import React from 'react'
import PollArchive from '@/components/PollArchive'

export interface PollArchiveBlockProps {
  number: number
}

export const PollArchiveBlock = ({ number }: PollArchiveBlockProps) => {
  return <PollArchive numberOfPolls={number} />
}
