import type {GlobalConfig} from 'payload'
import admin from "@/collections/Users/access/admin";
import {revalidateHeader} from "@/globals/SiteHeader/hooks/revalidateHeader";


export const SiteHeader: GlobalConfig = {
  slug: 'navigation-header',
  access: {
    update: admin
  },
  fields: [
    {
      name: "Links",
      type: "array",
        fields: [
            {
                name: "label",
                type: "text",
                label: "Label",
            },
            {
                name: "url",
                type: "text",
                label: "URL",
            },
        ],
    }
  ],
  hooks: {
    afterChange: [revalidateHeader]
  }
}
