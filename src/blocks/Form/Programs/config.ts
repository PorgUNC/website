import type { Block } from 'payload'

export const Programs: Block = {
  slug: 'programs',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Field Name',
      required: true,
      admin: {
        description: 'The name of the field that will be used in the form submission data.',
      },
    },
    {
      name: 'label',
      type: 'text',
      label: 'Field Label',
      required: true,
      admin: {
        description: 'The label that will be displayed above the field.',
      },
    },
    {
      name: 'width',
      type: 'number',
      label: 'Field Width (%)',
      admin: {
        description: 'The width of the field as a percentage of the form width (e.g., 50 for half width).',
      },
    },
    {
      name: 'required',
      type: 'checkbox',
      label: 'Required',
      defaultValue: false,
    },
    {
      name: 'defaultValue',
      type: 'text',
      label: 'Default Value',
      admin: {
        description: 'Optional: A single program value to pre-select (e.g., "computer-science-major-bs").',
      },
    },
  ],
  labels: {
    singular: 'Program',
    plural: 'Programs',
  },
}
