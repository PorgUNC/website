import React from 'react'
import Link from 'next/link'
import { FaFilePdf, FaFile, FaFileCode, FaFileAlt, FaFileImage } from 'react-icons/fa'
import type { Poll } from '@/payload-types'
import { cn } from '@/utilities/ui'

interface PollMaterialsProps {
  sidebar?: Poll['sidebar']
}

const iconMap = {
  FaFilePdf: FaFilePdf,
  FaFile: FaFile,
  FaFileCode: FaFileCode,
  FaFileAlt: FaFileAlt,
  FaFileImage: FaFileImage,
}

export default function PollMaterials({ sidebar }: PollMaterialsProps) {
  if (!sidebar || sidebar.length === 0) {
    return null
  }

  return (
    <aside className="w-full">
      <div className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-xl text-foreground">
            Report Materials
          </h2>
        </div>
        <ul className="space-y-3">
          {sidebar.map((item, index) => {
            const file = typeof item.file === 'object' ? item.file : null
            if (!file) return null

            const Icon = iconMap[item.icon]
            const fileUrl = file.url || ''

            return (
              <li key={item.id || index} className="flex items-center">
                <span className="mr-3 text-foreground">•</span>
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-3 flex-1',
                    'group focus-visible:outline-none focus-visible:underline'
                  )}
                >
                  <div className="flex-shrink-0 text-primary text-2xl group-hover:scale-110 transition-transform duration-200">
                    <Icon />
                  </div>
                  <p className="text-base font-medium text-foreground group-hover:text-primary group-hover:underline transition-colors">
                    {item.title}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
