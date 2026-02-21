import { cn } from '@/utilities/ui'
import React from 'react'
import { Card, CardPostData } from '@/components/Card'

export type CollectionArchiveProps = {
  docs: (CardPostData & { doc?: { relationTo?: 'posts' | 'polls' } })[]
  relationTo?: 'posts' | 'polls'
}

export const CollectionArchive: React.FC<CollectionArchiveProps> = ({ docs, relationTo }) => {
  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {docs?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              // For search results, use the doc.relationTo if available, otherwise use the prop
              const docRelation = (result as any).doc?.relationTo || relationTo || 'posts'
              return (
                <div className="col-span-4" key={index}>
                  <Card
                    className="h-full"
                    doc={result}
                    relationTo={docRelation}
                    showCategories={docRelation === 'posts'}
                  />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
