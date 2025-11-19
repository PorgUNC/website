import type { FieldHook } from 'payload'

export const updateFeaturedChartGlobal: FieldHook = async ({ value, req }) => {
  const payload = req.payload

  if (!value) {
    await payload.updateGlobal({
      slug: 'featured-poll',
      data: {
        poll: null,
      },
    })
    return value
  }

  await payload.updateGlobal({
    slug: 'featured-poll',
    data: {
      poll: value,
    },
  })

  return value
}
