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
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-muted/50 px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Report Materials
          </h2>
        </div>
        <div className="divide-y divide-border">
          {sidebar.map((item, index) => {
            const file = typeof item.file === 'object' ? item.file : null
            if (!file) return null

            const Icon = iconMap[item.icon]
            const fileUrl = file.url || ''

            return (
              <Link
                key={item.id || index}
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-3 px-4 py-3',
                  'hover:bg-muted/50 transition-colors duration-200',
                  'group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                )}
              >
                <div className="flex-shrink-0 text-primary text-xl group-hover:scale-110 transition-transform duration-200">
                  <Icon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
