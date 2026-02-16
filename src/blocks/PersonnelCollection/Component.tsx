import React from 'react'
import type {User} from '@/payload-types'
import {PersonCard} from '@/components/PersonCard'
import {cn} from '@/utilities/ui'

type Props = {
  personnel?: (number | User)[]
  className?: string
}

export const PersonnelCollectionBlock: React.FC<Props> = ({ personnel, className }) => {
  if (!personnel || personnel.length === 0) {
    return null
  }

  return (
    <div className={cn('w-full py-8', className)}>
      <div className="">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
          {personnel.map((person: number | User) => {
            const personId = typeof person === 'number' ? person : person.id
            return (
              <PersonCard
                key={personId}
                userId={person}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
