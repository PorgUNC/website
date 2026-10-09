import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { givenKey } = body

  if (!givenKey) {
    return NextResponse.json({ errors: [{ message: 'A secret key is required' }] }, { status: 400 })
  }

  const secretKey = process.env.CLEAN_TOKENS_CODE
  if (secretKey === '') {
    console.error('Clear tokens route secret key not found')
    return NextResponse.json({ errors: [{ status: 500 }]})
  }
  if (givenKey != secretKey) {
    return NextResponse.json({ errors: [{ message: 'Invalid key' }] }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  const result = await payload.update({
    collection: 'forms',
    where: {
      'tokens.formToken' : {
        exists: true
      }
    },
    data: {
      tokens: [],
    },
    depth: 2,
  })

  if (result.errors.length === 0) {
    return NextResponse.json(
      {
        message: 'Tokens cleared successfully, probably',
      },
      { status: 200 },
    )
  }

  return NextResponse.json(
    {
      message: 'Token clearing failed',
      body: result.errors
    },
    { status: 418 },
  )
}
