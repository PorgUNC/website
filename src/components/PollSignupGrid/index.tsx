'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getDaySlots, getPollWeekdays } from '@/lib/pollTimes'
import 'add-to-calendar-button';
import './index.scss'

type Signup = { name: string; slots: string[]; userId?: number }
type Executive = { name: string; slots: string[] }
type PollData = {
  startDate: string
  endDate: string
  additionalInfo: string | null
  availableSlots: string[]
  signups: Signup[]
  currentUserName: string | null
  isAdmin: boolean
  adminSlots: string[]
  currentUserSlots: string[]
  executives: Executive[]
}

type SlotCellProps = {
  slot: string
  day: string
  available: boolean
  checked: boolean
  signupNames: string[]
  onToggle: (slot: string, checked: boolean | 'indeterminate') => void
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? '?'
  return `${words[0][0]?.toUpperCase() ?? ''}${words[words.length - 1][0]?.toUpperCase() ?? ''}`
}

function getNameColor(name: string) {
  const seed = [...name].reduce((total, char) => total + char.charCodeAt(0), 0)
  const hue = seed % 360
  return `hsl(${hue} 68% 62%)`
}

const SlotCell = memo(function SlotCell({
  slot,
  day,
  available,
  checked,
  signupNames,
  onToggle,
}: SlotCellProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressTriggered = useRef(false)
  const slotDescription = `${formatDay(day)} ${formatTime(slot)}${
    signupNames.length ? ` — ${signupNames.join(', ')}` : ''
  }`

  useEffect(
    () => () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current)
      if (hideTooltipTimer.current) clearTimeout(hideTooltipTimer.current)
    },
    [],
  )

  function startLongPress() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    if (hideTooltipTimer.current) clearTimeout(hideTooltipTimer.current)
    longPressTriggered.current = false
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true
      setShowTooltip(true)
    }, 500)
  }

  function endLongPress() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    longPressTimer.current = null
    if (longPressTriggered.current) {
      hideTooltipTimer.current = setTimeout(() => setShowTooltip(false), 2000)
    }
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-describedby={showTooltip ? `slot-tooltip-${slot}` : undefined}
      aria-label={available ? slotDescription : 'Unavailable'}
      disabled={!available}
      onPointerDown={startLongPress}
      onPointerUp={endLongPress}
      onPointerCancel={endLongPress}
      onContextMenu={(event) => {
        event.preventDefault()
        if (!showTooltip) {
          longPressTriggered.current = true
          setShowTooltip(true)
          hideTooltipTimer.current = setTimeout(() => setShowTooltip(false), 2000)
        }
      }}
      onClick={(event) => {
        if (longPressTriggered.current) {
          event.preventDefault()
          longPressTriggered.current = false
          return
        }
        onToggle(slot, !checked)
      }}
      className={`poll-signup-grid__slot ${
        checked
          ? 'poll-signup-grid__slot--checked'
          : available
            ? 'poll-signup-grid__slot--available'
            : 'poll-signup-grid__slot--unavailable'
      } ${showTooltip ? 'poll-signup-grid__slot--tooltip-open' : ''}`}
      title={available ? slotDescription : 'Unavailable'}
    >
      {signupNames.length > 0 && (
        <div className="poll-signup-grid__signup-names">
          {signupNames.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className={`poll-signup-grid__avatar ${index > 0 ? 'poll-signup-grid__avatar--overlap' : ''}`}
              style={{ backgroundColor: getNameColor(name) }}
              title={name}
            >
              {getInitials(name)}
            </span>
          ))}
        </div>
      )}
      <span className="poll-signup-grid__slot-time">
        {formatTime(slot)}–
        {formatTime(new Date(new Date(slot).getTime() + 15 * 60 * 1000).toISOString())}
      </span>
      {showTooltip && (
        <span
          id={`slot-tooltip-${slot}`}
          role="tooltip"
          className="poll-signup-grid__tooltip"
        >
          {slotDescription}
        </span>
      )}
    </button>
  )
})

function formatDay(day: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${day}T12:00:00Z`))
}

function formatTime(slot: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  }).format(new Date(slot))
}

function getCalendarDate(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/New_York',
  }).formatToParts(date)
  const part = (type: 'year' | 'month' | 'day') =>
    parts.find((value) => value.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

function getCalendarTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'America/New_York',
  }).format(date)
}

export default function PollSignupGrid({ uuid, givenName }: { uuid: string; givenName: string }) {
  const [data, setData] = useState<PollData | null>(null)
  const [name, setName] = useState(givenName ?? '')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedSlots, setSavedSlots] = useState<string[]>([])
  const adminMode = data?.isAdmin ?? false

  const calendarUrl = useMemo(() => {
    const trimmedName = name.trim()
    if (!trimmedName || typeof window === 'undefined') return undefined

    const url = new URL(window.location.href)
    url.searchParams.set('name', trimmedName)
    return url.toString()
  }, [name])
  const calendarDescription = [
    data?.additionalInfo,
    calendarUrl && `[url]${calendarUrl}|View poll signup[/url]`,
  ]
    .filter(Boolean)
    .join('\n\n')

  useEffect(() => {
    fetch(`/api/custom/pollsignups/${encodeURIComponent(uuid)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Poll not found')
        return response.json() as Promise<PollData>
      })
      .then((poll) => {
        setData(poll)
        setName(poll.currentUserName ?? givenName ?? '')
        setSelected(new Set(poll.isAdmin ? poll.adminSlots : poll.currentUserSlots))
        setSavedSlots(poll.currentUserSlots)
      })
      .catch(() => setStatus('This poll could not be found.'))
  }, [uuid, givenName])

  const allSlotsByDay = useMemo(() => {
    if (!data) return []
    return getPollWeekdays(data.startDate, data.endDate).map((day) => ({
      day,
      slots: getDaySlots(day),
    }))
  }, [data])

  const slotsByDay = useMemo(() => {
    if (!data) return []
    return allSlotsByDay.filter(
      ({ slots }) => adminMode || slots.some((slot) => data.availableSlots.includes(slot)),
    )
  }, [allSlotsByDay, adminMode, data])

  const visibleTimeIndexes = useMemo(() => {
    if (!data || adminMode) return Array.from({ length: 40 }, (_, index) => index)
    const acceptableIndexes = allSlotsByDay.flatMap(({ day, slots }) =>
      slots
        .map((slot, index) => (data.availableSlots.includes(slot) ? index : -1))
        .filter((index) => index >= 0),
    )
    if (acceptableIndexes.length === 0) return []
    const first = Math.min(...acceptableIndexes)
    const last = Math.max(...acceptableIndexes)
    return Array.from({ length: last - first + 1 }, (_, index) => first + index)
  }, [allSlotsByDay, adminMode, data])

  const baseSlots = useMemo(() => getDaySlots('2000-01-03'), [])

  const signupNamesBySlot = useMemo(() => {
    if (!data) return new Map<string, string[]>()
    const names = new Map<string, string[]>()
    for (const executive of data.executives) {
      for (const slot of executive.slots) {
        const slotNames = names.get(slot) ?? []
        slotNames.push(executive.name)
        names.set(slot, slotNames)
      }
    }
    for (const signup of data.signups) {
      for (const slot of signup.slots) {
        const slotNames = names.get(slot) ?? []
        slotNames.push(signup.name)
        names.set(slot, slotNames)
      }
    }
    return names
  }, [data])

  useEffect(() => {
    if (!data || data.currentUserName || adminMode || !name.trim()) return
    const signup = data.signups.find(
      (entry) => entry.name.trim().toLowerCase() === name.trim().toLowerCase(),
    )
    if (signup) setSelected(new Set(signup.slots))
  }, [adminMode, data, name])

  const toggle = useCallback(
    (slot: string, checked: boolean | 'indeterminate') => {
      if (!adminMode && !data?.availableSlots.includes(slot)) return
      setSelected((previous) => {
        const next = new Set(previous)
        if (checked === true) next.add(slot)
        else next.delete(slot)
        return next
      })
    },
    [adminMode, data?.availableSlots],
  )

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('')
    setSaved(false)
    setSaving(true)
    try {
      const response = await fetch(`/api/custom/pollsignups/${encodeURIComponent(uuid)}`, {
        method: adminMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slots: [...selected] }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to save availability.')
      if (adminMode) {
        setData((current) =>
          current
            ? {
                ...current,
                availableSlots: result.availableSlots,
                adminSlots: result.availableSlots,
              }
            : current,
        )
      } else {
        setData((current) => {
          if (!current) return current
          const signups = current.signups.filter(
            (signup) => signup.name.trim().toLowerCase() !== name.trim().toLowerCase(),
          )
          return { ...current, signups: [...signups, { name: name.trim(), slots: [...selected] }] }
        })
      }
      setSaved(true)
      setSavedSlots([...selected])
      setStatus(result.message)
    } catch (caughtError) {
      setStatus(caughtError instanceof Error ? caughtError.message : 'Unable to save availability.')
    } finally {
      setSaving(false)
    }
  }

  function getCalendarEvents() {
    const slots = [...savedSlots].sort()
    const events: { start: Date; end: Date }[] = []
    let start: string | undefined
    let previous: Date | undefined

    for (const slot of [...slots, '']) {
      const current = slot ? new Date(slot) : undefined
      const isAdjacent =
        current && previous && current.getTime() - previous.getTime() === 15 * 60 * 1000
      if (start && !isAdjacent) {
        const end = new Date(previous!.getTime() + 15 * 60 * 1000)
        events.push({ start: new Date(start), end })
        start = undefined
      }
      if (current) {
        if (!start) start = slot
        previous = current
      }
    }

    return events
  }

  if (!data) return <p className="container py-16">{status || 'Loading poll...'}</p>

  return (
    <main className="poll-signup-grid">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          {adminMode ? 'Set executive availability' : 'When are you available?'}
        </h1>
        {data.additionalInfo && (
          <p className="mt-3 text-base font-medium">
            <span className="font-normal">{data.additionalInfo}</span>
          </p>
        )}
        <p className="mt-2 text-muted-foreground">
          {adminMode
            ? 'Choose the 15-minute times that should be available to participants.'
            : 'Select every 15-minute time that works for you.'}
        </p>
      </div>
      <form onSubmit={submit}>
        {!adminMode && !data.currentUserName && (
          <label className="mb-6 block max-w-sm text-sm font-medium">
            Your name
            <input
              className="mt-2 block h-10 w-full rounded border border-border bg-background px-3"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={100}
            />
          </label>
        )}
        <p className="mb-2 text-xs text-muted-foreground sm:hidden">
          Scroll to the right to see more days
        </p>
        <div className="poll-signup-grid__viewport">
          <div
            className="poll-signup-grid__scroll-area"
            role="region"
            aria-label="Poll availability grid"
          >
            <div
              className="poll-signup-grid__table"
              style={{
                gridTemplateColumns: `4.5rem repeat(${slotsByDay.length}, minmax(8rem, 1fr))`,
              }}
            >
              <div className="poll-signup-grid__corner" />
              {slotsByDay.map(({ day }) => (
                <div
                  key={day}
                  className="poll-signup-grid__day-heading"
                >
                  {formatDay(day)}
                </div>
              ))}
              {visibleTimeIndexes.map((index) => {
                const time = baseSlots[index]
                return (
                  <div key={time} className="poll-signup-grid__row">
                    <div className="poll-signup-grid__time-label">
                      {formatTime(time)}
                    </div>
                    {slotsByDay.map(({ day, slots }) => {
                      const slot = slots[index]
                      const available = adminMode || data.availableSlots.includes(slot)
                      const checked = selected.has(slot)
                      const signupNames = signupNamesBySlot.get(slot) ?? []
                      return (
                        <SlotCell
                          key={slot}
                          slot={slot}
                          day={day}
                          available={available}
                          checked={checked}
                          signupNames={signupNames}
                          onToggle={toggle}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            disabled={saving || (!adminMode && (selected.size === 0 || !name.trim()))}
          >
            {saving ? 'Saving...' : adminMode ? 'Publish executive times' : 'Save availability'}
          </Button>
          {status && (
            <p role="status" className="text-sm">
              {status}
            </p>
          )}
        </div>
      </form>
      {saved && savedSlots.length > 0 && (
        <div className="mt-6 rounded-lg border border-border p-4">
          <h2 className="font-semibold">Add your availability to a calendar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These links combine adjacent 15-minute selections into larger events.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {getCalendarEvents().map((event) => (
              <add-to-calendar-button
                key={`${event.start.toISOString()}-${event.end.toISOString()}`}
                name="PORG Polling"
                label={`${formatDay(getCalendarDate(event.start))} · ${formatTime(event.start.toISOString())}–${formatTime(event.end.toISOString())}`}
                size="3"
                options="'google','apple','outlook.com','ical','yahoo'"
                description={calendarDescription}
                ics-url={calendarUrl}
                start-date={getCalendarDate(event.start)}
                end-date={getCalendarDate(event.end)}
                start-time={getCalendarTime(event.start)}
                end-time={getCalendarTime(event.end)}
                time-zone="America/New_York"
              ></add-to-calendar-button>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
