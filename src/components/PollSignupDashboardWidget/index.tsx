'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import PollSignupGrid from '@/components/PollSignupGrid'
import './index.scss'

type PollTime = {
  uuid: string
  startDate: string
}

type PollTimesResponse = {
  docs: PollTime[]
}

function formatStartDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export default function PollSignupDashboardWidget() {
  const [pollTimes, setPollTimes] = useState<PollTime[]>([])
  const [selectedUUID, setSelectedUUID] = useState('')
  const [loadedUUID, setLoadedUUID] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPollTimes() {
      try {
        const query = new URLSearchParams({
          limit: '2',
          sort: '-startDate',
          depth: '0',
          'select[uuid]': 'true',
          'select[startDate]': 'true',
        })
        const response = await fetch(`/api/polltimes?${query}`, { signal: controller.signal })
        if (!response.ok) throw new Error('Unable to load poll start dates.')

        const result = (await response.json()) as PollTimesResponse
        const docs = result.docs.filter((poll) => poll.uuid && poll.startDate)
        setPollTimes(docs)
        setSelectedUUID(docs[0]?.uuid ?? '')
      } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.name === 'AbortError') return
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load poll start dates.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadPollTimes()
    return () => controller.abort()
  }, [])

  return (
    <section className="poll-signup-dashboard-widget">
      <h2 className="poll-signup-dashboard-widget__title">Poll Signup Grid</h2>
      <div className="poll-signup-dashboard-widget__controls">
        <label className="poll-signup-dashboard-widget__label" htmlFor="poll-signup-start-date">
          Poll start date
        </label>
        <select
          id="poll-signup-start-date"
          className="poll-signup-dashboard-widget__select"
          value={selectedUUID}
          onChange={(event) => {
            setSelectedUUID(event.target.value)
            setLoadedUUID('')
          }}
          disabled={loading || pollTimes.length === 0}
        >
          {pollTimes.length === 0 && <option value="">No polls available</option>}
          {pollTimes.map((poll) => (
            <option key={poll.uuid} value={poll.uuid}>
              {formatStartDate(poll.startDate)}
            </option>
          ))}
        </select>
        <Button
          type="button"
          onClick={() => setLoadedUUID(selectedUUID)}
          disabled={loading || !selectedUUID}
        >
          {loading ? 'Loading polls...' : 'Load grid'}
        </Button>
      </div>
      {error && <p className="poll-signup-dashboard-widget__message" role="alert">{error}</p>}
      {!loading && !error && pollTimes.length === 0 && (
        <p className="poll-signup-dashboard-widget__message">No poll times found.</p>
      )}
      {loadedUUID && <PollSignupGrid key={loadedUUID} uuid={loadedUUID} givenName="" />}
    </section>
  )
}
