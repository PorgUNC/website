import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { validateTotp } from '@/lib/totp/validateTotp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { form: formID, submissionData, token, authKey, validDuration } = body

    // Validate required fields
    if (!formID) {
      return NextResponse.json(
        { errors: [{ message: 'Form ID is required' }] },
        { status: 400 }
      )
    }

    if (!submissionData || !Array.isArray(submissionData)) {
      return NextResponse.json(
        { errors: [{ message: 'Invalid submission data' }] },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Fetch the form to verify it exists and is enabled
    const form = await payload.findByID({
      collection: 'forms',
      id: formID,
    })

    if (!form) {
      return NextResponse.json(
        { errors: [{ message: 'Form not found' }] },
        { status: 404 }
      )
    }

    // Check if form is enabled for polls
    if (form.isPoll && !form.enabled) {
      return NextResponse.json(
        { errors: [{ message: 'This form is not accepting responses' }] },
        { status: 403 }
      )
    }

    // If this is a poll, validate the token
    if (form.isPoll) {
      if (!token || !authKey || !validDuration) {
        return NextResponse.json(
          { errors: [{ message: 'Token validation parameters are required for polls' }] },
          { status: 400 }
        )
      }

      // Validate the TOTP token
      const isValidToken = validateTotp(token, authKey, validDuration, 10)

      if (!isValidToken) {
        return NextResponse.json(
          { errors: [{ message: 'Invalid or expired token' }] },
          { status: 401 }
        )
      }

      // Check if token has already been used
      const tokenExists = form.tokens?.some(
        (tokenEntry: { formToken?: string }) => tokenEntry.formToken === token
      )

      if (tokenExists) {
        return NextResponse.json(
          { errors: [{ message: 'This token has already been used. Each token can only be used once.' }] },
          { status: 409 }
        )
      }
    }

    // Create the form submission
    // For poll forms with validated tokens, we bypass access control
    // For non-poll forms, the access control allows direct submission
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: formID,
        submissionData,
      },
    })

    // If this is a poll, add the token to the form's tokens array
    if (form.isPoll && token) {
      try {
        await payload.update({
          collection: 'forms',
          id: formID,
          data: {
            tokens: [
              ...(form.tokens || []),
              { formToken: token }
            ],
          },
        })
      } catch (error) {
        console.error('Error storing token:', error)
        // Don't fail the submission if token storage fails
        // The submission has already been created successfully
      }
    }

    return NextResponse.json(
      {
        message: 'Form submission successful',
        doc: submission,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      { errors: [{ message: 'Internal server error' }] },
      { status: 500 }
    )
  }
}
