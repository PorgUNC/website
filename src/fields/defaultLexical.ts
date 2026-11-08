import type { TextFieldSingleValidation } from 'payload'
import {
  BlocksFeature,
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
  type LinkFields,
  IndentFeature,
  HorizontalRuleFeature,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  OrderedListFeature,
  UnorderedListFeature,
  TextStateFeature,
  AlignFeature,
  BlockquoteFeature,
  ChecklistFeature,
  InlineCodeFeature,
  RelationshipFeature,
  UploadFeature,
  defaultColors,
} from '@payloadcms/richtext-lexical'

import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'

export const defaultLexical = lexicalEditor({
  features: [
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
    ParagraphFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    BlocksFeature({ blocks: [Code, MediaBlock] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    InlineCodeFeature(),
    HorizontalRuleFeature(),
    IndentFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    ChecklistFeature(),
    TextStateFeature({
      state: {
        color: {
          ...defaultColors.text,
          'text-gray': {
            label: 'Muted',
            css: { color: 'hsl(var(--muted-foreground))' },
          },
        },
      },
    }),
    AlignFeature(),
    BlockquoteFeature(),
    RelationshipFeature({ enabledCollections: ['pages', 'posts', 'polls'] }),
    UploadFeature({ enabledCollections: ['media'] }),
    LinkFeature({
      enabledCollections: ['pages', 'posts', 'polls'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true // no validation needed, as no url should exist for internal links
              }
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
  ],
})
