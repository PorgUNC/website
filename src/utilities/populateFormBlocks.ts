type FormBlock = {
  blockType?: string
  form?: number | object
  [key: string]: unknown
}

type DocumentWithLayout = {
  layout?: unknown
}

export async function populateFormBlocks<T extends DocumentWithLayout>(
  document: T,
  findForm: (id: number) => Promise<unknown>,
): Promise<T> {
  if (!Array.isArray(document.layout)) {
    return document
  }

  const layout = await Promise.all(
    document.layout.map(async (block) => {
      if (!block || typeof block !== 'object') {
        return block
      }

      const formBlock = block as FormBlock
      if (formBlock.blockType !== 'formBlock' || typeof formBlock.form !== 'number') {
        return block
      }

      return {
        ...formBlock,
        form: await findForm(formBlock.form),
      }
    }),
  )

  return {
    ...document,
    layout,
  } as T
}
