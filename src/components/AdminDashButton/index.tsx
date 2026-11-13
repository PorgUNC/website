'use client'

import Link from 'next/link'
import './index.scss'

export function BackToDash() {
  return (
    <Link href="/admin" className="customDashButton">
      Go to Dashboard
    </Link>
  )
}

export function BackToHome() {
  return (
    <Link href="/" className="customDashButton">
      Go to Main Site
    </Link>
  )
}
