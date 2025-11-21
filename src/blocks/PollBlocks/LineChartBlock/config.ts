import type { Block } from "payload";

export const LineChartBlock: Block = {
  slug: "lineChart",
  labels: {
    singular: "Line Chart",
    plural: "Line Charts",
  },
  fields: [
    {
      name: "chartIndex",
      type: "number",
      required: true,
      admin: {
        description:
          "Index of the line chart from the Statistics tab (starting at 1).",
      },
    },
    {
      name: "showLegend",
      type: "checkbox",
      label: "Show Legend",
      defaultValue: true,
    },
    {
      name: "showDots",
      type: "checkbox",
      label: "Show Data Points",
      defaultValue: true,
    },
    {
      name: 'lineChart',
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
          name: 'series',
          type: 'array',
          labels: {
            singular: 'Series',
            plural: 'Series',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'data',
              type: 'array',
              labels: {
                singular: 'Point',
                plural: 'Points',
              },
              fields: [
                {
                  name: 'x',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'y',
                  type: 'number',
                  required: true,
                },
              ],
            },
            {
              name: 'color',
              type: 'text',
            },
          ],
        },
      ],
      hooks: {
        afterRead: [
          ({ data, siblingData }) => {
            return data?.statistics?.lineCharts[siblingData.chartIndex - 1]
          }
        ]
      }
    },
  ],
};
