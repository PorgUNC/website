'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import React, {useEffect, useState} from 'react'

import type {Theme} from './types'
import {themeLocalStorageKey} from './types'

import {useTheme} from '..'

export const ThemeSelector: React.FC = () => {
  const {setTheme} = useTheme()
  const [value, setValue] = useState<Theme>('light')

  const onThemeChange = (themeToSet: Theme) => {
    setTheme(themeToSet)
    setValue(themeToSet)
    window.localStorage.setItem(themeLocalStorageKey, themeToSet)
  }

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey) as Theme | null
    if (preference) {
      setValue(preference)
      setTheme(preference)
    } else {
      setValue('light')
      setTheme('light')
      window.localStorage.setItem(themeLocalStorageKey, 'light')
    }
  }, [setTheme])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label="Select a theme"
        className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
      >
        <SelectValue placeholder="Theme"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  )
}
