import {HeaderClient} from './Component.client'
import React from 'react'
import {getCachedGlobal} from '@/utilities/getGlobals'


export async function Header() {
  const headerData = await getCachedGlobal('navigation-header', 0)()

  return <HeaderClient headerData={headerData} />
}
