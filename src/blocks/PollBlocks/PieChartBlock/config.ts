import type { Block } from "payload";

export const PieChartBlock: Block = {
  slug: "pieChart",
  labels: {
    singular: "Pie Chart",
    plural: "Pie Charts",
  },
  fields: [
    {
      name: "chartIndex",
      type: "number",
      required: true,
      admin: {
        description:
          "Index of the pie chart from the Statistics tab (starting at 1).",
      },
    },
    {
      name: "showLegend",
      type: "checkbox",
      label: "Show Legend",
      defaultValue: true,
    },
    {
      name: 'pieChart',
      type: 'group',
      virtual: true,
      admin: {
        hidden: true
      },
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'data',
          type: 'array',
          labels: {
            singular: 'Slice',
            plural: 'Slices',
          },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'value', type: 'number', required: true },
            { name: 'color', type: 'text' },
          ],
        },
      ],
      hooks: {
        afterRead: [
          ({ data, siblingData }) => {
            return data?.statistics?.pieCharts[siblingData.chartIndex - 1]
          }
        ]
      }
    },
  ],
};
