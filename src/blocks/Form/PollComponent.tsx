'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { TotpTimer } from '@/components/TotpTimer'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type PollFormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  token: string
  validDuration: number
  authKey: string
  isPoll: true
  tokenGeneratedAt: number // timestamp in seconds when token was generated
}

export const PollFormBlock: React.FC<
  {
    id?: string
  } & PollFormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    introContent,
    token,
    validDuration,
    authKey,
    tokenGeneratedAt,
  } = props

  const formID = formFromProps.id
  const { confirmationMessage, confirmationType, redirect, submitButtonLabel = 'Submit' } = formFromProps

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [isTokenExpired, setIsTokenExpired] = useState(false)
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        if (isTokenExpired) {
          setError({
            message: 'Your session has expired. Please request a new QR code.',
          })
          return
        }

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
              token,
              authKey,
              validDuration,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, token, authKey, validDuration, isTokenExpired],
  )

  return (
    <div className="container lg:max-w-[48rem]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
          {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
          {!hasSubmitted && (
            <>
              <TotpTimer
                token={token}
                validDuration={validDuration}
                period={10}
                tokenGeneratedAt={tokenGeneratedAt}
                onExpired={() => setIsTokenExpired(true)}
              />
              <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 last:mb-0">
                  {formFromProps &&
                    formFromProps.fields &&
                    formFromProps.fields?.map((field, index) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                      if (Field) {
                        return (
                          <div className="mb-6 last:mb-0" key={index}>
                            <Field
                              form={formFromProps}
                              {...field}
                              {...formMethods}
                              control={control}
                              errors={errors}
                              register={register}
                            />
                          </div>
                        )
                      }
                      return null
                    })}
                </div>

                <Button
                  form={formID}
                  type="submit"
                  variant="default"
                  disabled={isTokenExpired}
                >
                  {submitButtonLabel}
                </Button>
              </form>
            </>
          )}
        </FormProvider>
      </div>
    </div>
  )
}

