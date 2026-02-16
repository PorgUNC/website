import React from 'react'
import {User} from '@/payload-types'
import {Media} from '@/components/Media'
import {getPayload} from 'payload'
import configPromise from '@payload-config'

type PersonCardProps = {
  userId: number | User
}

export const PersonCard = async ({ userId }: PersonCardProps) => {
  let user: User

  if (typeof userId === 'number') {
    const payload = await getPayload({ config: configPromise })
    user = await payload.findByID({
      collection: 'users',
      id: userId,
      depth: 2,
    })
  } else {
    user = userId
  }

  const { name, avatar, jobTitle } = user

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-32 md:h-32 rounded-full overflow-hidden ">
        {avatar && typeof avatar === 'object' ? (
          <Media
            resource={avatar}
            fill
            imgClassName="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-3xl sm:text-4xl md:text-3xl font-semibold text-muted-foreground">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-0">
        <p className="text-base sm:text-lg md:text-base font-medium text-center group-hover:text-primary transition-colors mt-2">
          {name}
        </p>
        {jobTitle && (
          <p className="text-sm sm:text-base md:text-sm text-muted-foreground text-center">
            {jobTitle}
          </p>
        )}
      </div>
    </div>
  )
}
