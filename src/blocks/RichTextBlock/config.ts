import type {Block} from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import {Banner} from '@/blocks/Banner/config'
import {Code} from '@/blocks/Code/config'
import {MediaBlock} from '@/blocks/MediaBlock/config'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({rootFeatures}) => {
          return [
            ...rootFeatures,
            HeadingFeature({enabledHeadingSizes: ['h2', 'h3', 'h4']}),
            BlocksFeature({blocks: [Banner, Code, MediaBlock]}),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
  ],
}
