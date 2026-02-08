import type { Block } from 'payload'

export const Year: Block = {
  slug: 'year',
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
      name: 'minYear',
      type: 'number',
      label: 'Minimum Year',
      required: true,
      admin: {
        description: 'The earliest year that can be selected (e.g., 1900).',
      },
    },
    {
      name: 'maxYear',
      type: 'number',
      label: 'Maximum Year',
      required: true,
      admin: {
        description: 'The latest year that can be selected (e.g., 2100).',
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
        description: 'The default year value to pre-select (e.g., 2000).',
      },
    },
    {
      name: 'allowMultiple',
      type: 'checkbox',
      label: 'Allow Multiple Selection',
      defaultValue: false,
      admin: {
        description: 'Allow users to select multiple years.',
      },
    },
    {
      name: 'allowSearching',
      type: 'checkbox',
      label: 'Allow Searching',
      defaultValue: false,
      admin: {
        description: 'Add a search box to filter year options (only works with multiple selection).',
      },
    },
  ],
  labels: {
    singular: 'Year',
    plural: 'Years',
  },
}
