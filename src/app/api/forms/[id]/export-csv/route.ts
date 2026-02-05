import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const form = await payload.findByID({
      collection: 'forms',
      id: formId,
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    const submissions = await payload.find({
      collection: 'form-submissions',
      where: {
        form: {
          equals: formId,
        },
      },
      limit: 1000,
      sort: '-createdAt',
    })

    if (!submissions.docs || submissions.docs.length === 0) {
      return new NextResponse('No submissions found for this form', {
        status: 404,
      })
    }

    const fieldNames = form.fields?.map((field: any) => {
      if ('name' in field) {
        return field.name
      }
      return null
    }).filter(Boolean) || []

    const headers = ['Submission ID', 'Submitted At', ...fieldNames]

    const rows = submissions.docs.map((submission: any) => {
      const submissionDataMap = new Map()

      submission.submissionData?.forEach((item: any) => {
        submissionDataMap.set(item.field, item.value)
      })

      const row = [
        submission.id,
        new Date(submission.createdAt).toISOString(),
        ...fieldNames.map((fieldName: string) => {
          const value = submissionDataMap.get(fieldName)
          if (Array.isArray(value)) {
            return `"${value.join(', ')}"`
          }
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value)}"`
          }
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ''
        })
      ]

      return row
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="form-${formId}-submissions-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting form submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
