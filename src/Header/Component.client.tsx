'use client'
import {useHeaderTheme} from '@/providers/HeaderTheme'
import {usePathname} from 'next/navigation'
import React, {useEffect, useState} from 'react'
import type {NavigationHeader} from '@/payload-types'

// import type {Header} from '@/payload-types'
import {Logo} from '@/components/Logo/Logo'
import HeroHeader from "@/components/ui/header";

interface HeaderClientProps {
  headerData: NavigationHeader
}

export const HeaderClient = ({ headerData }: HeaderClientProps) => {
  const [theme, setTheme] = useState<string | null>(null)
  const {headerTheme, setHeaderTheme} = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <HeroHeader links={headerData.Links || []} />
  )
}
