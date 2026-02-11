import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { PollFormBlock } from '@/blocks/Form/PollComponent'
import { FormBlock } from '@/blocks/Form/Component'
import { generateMeta } from '@/utilities/generateMeta'
import { validateTotp } from '@/lib/totp/validateTotp'

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    token?: string
  }>
}

export default async function FormPage({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const { token } = await searchParamsPromise

  const payload = await getPayload({ config: configPromise })

  // Fetch the form by ID (slug)
  const formId = parseInt(slug, 10)

  if (isNaN(formId)) {
    notFound()
  }

  try {
    const form = await payload.findByID({
      collection: 'forms',
      id: formId,
    })

    // Check if form exists
    if (!form) {
      notFound()
    }

    // For polls, enforce token requirement and enabled status
    if (form.isPoll) {
      // Check if accepting responses
      if (!form.enabled) {
        return (
          <div className="py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Form Unavailable</h1>
              <p className="text-gray-600">This form is not currently accepting responses.</p>
            </div>
          </div>
        )
      }

      // Check if token is provided
      if (!token) {
        return (
          <div className="py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Token Required</h1>
              <p className="text-gray-600">A valid token is required to access this form. Please scan the QR code to get a valid token.</p>
            </div>
          </div>
        )
      }

      // Validate the token and find which period it was generated in
      const period = 10 // seconds
      const validDurationInSeconds = (form.validDuration || 5) * 60
      const windowSize = Math.ceil(validDurationInSeconds / period)

      // We need to find the exact period when this token was generated
      // by checking against all periods within the valid window
      const now = Math.floor(Date.now() / 1000) // current time in seconds
      const currentPeriod = Math.floor(now / period)

      let tokenGeneratedAt: number | null = null
      let isValidToken = false

      // Check current period and previous periods within the window
      const { generateTotpPublic } = await import('@/lib/totp/generateTotpPublic')

      for (let i = 0; i <= windowSize; i++) {
        const testPeriod = currentPeriod - i
        const testTimestamp = testPeriod * period

        const generatedToken = generateTotpPublic(form.authKey || '', period, testTimestamp * 1000)

        if (generatedToken === token) {
          tokenGeneratedAt = testTimestamp
          isValidToken = true
          break
        }
      }

      if (!isValidToken || tokenGeneratedAt === null) {
        return (
          <div className="py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Invalid Token</h1>
              <p className="text-gray-600">The token provided is invalid or has expired. Please scan a new QR code.</p>
            </div>
          </div>
        )
      }

      // Check if token has already been used
      const tokenExists = form.tokens?.some(
        (tokenEntry: { formToken?: string }) => tokenEntry.formToken === token
      )

      if (tokenExists) {
        return (
          <div className="py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Token Already Used</h1>
              <p className="text-gray-600">This token has already been used to submit a response. Each token can only be used once. Please scan a new QR code.</p>
            </div>
          </div>
        )
      }

      return (
        <div className="py-16">
          <PollFormBlock
            form={form as unknown as FormType}
            enableIntro={false}
            token={token}
            validDuration={form.validDuration || 5}
            authKey={form.authKey || ''}
            isPoll={true}
            tokenGeneratedAt={tokenGeneratedAt}
          />
        </div>
      )
    }

    // For non-poll forms, render without token requirement
    return (
      <div className="py-16">
        <FormBlock
          form={form as unknown as FormType}
          enableIntro={false}
        />
      </div>
    )
  } catch (error) {
    console.error('Error fetching form:', error)
    notFound()
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const formId = parseInt(slug, 10)

  if (isNaN(formId)) {
    return {}
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const form = await payload.findByID({
      collection: 'forms',
      id: formId,
    })

    if (!form) {
      return {}
    }

    return generateMeta({ doc: form })
  } catch (error) {
    return {}
  }
}
