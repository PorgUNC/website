'use client'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getDaySlots, getPollWeekdays } from '@/lib/pollTimes'

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

const SlotCell = memo(function SlotCell({
  slot,
  day,
  available,
  checked,
  signupNames,
  onToggle,
}: SlotCellProps) {
  return (
    <label
      className={`m-0.5 flex min-h-7 items-center justify-center rounded-sm border text-xs transition-colors ${
        checked
          ? 'border-green-700 bg-green-500 text-white hover:bg-green-600 dark:border-green-200 dark:bg-green-500'
          : available
            ? 'cursor-pointer border-blue-600 bg-blue-400 hover:bg-blue-500 dark:border-blue-300 dark:bg-blue-600'
            : 'cursor-not-allowed border-border bg-muted/50'
      }`}
      title={
        available
          ? `${formatDay(day)} ${formatTime(slot)}${
              signupNames.length ? ` — ${signupNames.join(', ')}` : ''
            }`
          : 'Unavailable'
      }
    >
      <Checkbox
        className="sr-only"
        checked={checked}
        disabled={!available}
        onCheckedChange={(value) => onToggle(slot, value)}
      />
      <span className="sr-only">{formatTime(slot)}</span>
    </label>
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

export function PollSignupGrid({ uuid }: { uuid: string }) {
  const [data, setData] = useState<PollData | null>(null)
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedSlots, setSavedSlots] = useState<string[]>([])

  useEffect(() => {
    fetch(`/api/custom/pollsignups/${encodeURIComponent(uuid)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Poll not found')
        return response.json() as Promise<PollData>
      })
      .then((poll) => {
        setData(poll)
        setName(poll.currentUserName ?? '')
        setSelected(new Set(poll.isAdmin ? poll.adminSlots : poll.currentUserSlots))
        setSavedSlots(poll.currentUserSlots)
      })
      .catch(() => setStatus('This poll could not be found.'))
  }, [uuid])

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
        setSaved(true)
        setSavedSlots([...selected])
      }
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

  function googleCalendarUrl(event: { start: Date; end: Date }) {
    const stamp = (date: Date) =>
      date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '')
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'PORG Polling',
      ...(data?.additionalInfo ? { details: data.additionalInfo } : {}),
      dates: `${stamp(event.start)}/${stamp(event.end)}`,
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  if (!data) return <p className="container py-16">{status || 'Loading poll...'}</p>

  return (
    <main className="container max-w-7xl py-2">
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
        {data.isAdmin && (
          <div className="mb-6 flex items-center gap-3">
            <Button
              type="button"
              variant={adminMode ? 'default' : 'outline'}
              onClick={() => {
                setAdminMode((current) => !current)
                setSelected(new Set(data.adminSlots))
                setStatus('')
              }}
            >
              {adminMode ? 'Participant view' : 'Edit executive times'}
            </Button>
          </div>
        )}
        <div className="overflow-x-auto rounded-lg border border-border">
          <div
            className="grid min-w-[42rem]"
            style={{
              gridTemplateColumns: `4.5rem repeat(${slotsByDay.length}, minmax(8rem, 1fr))`,
            }}
          >
            <div className="border-b border-border bg-muted/40 p-2" />
            {slotsByDay.map(({ day }) => (
              <div
                key={day}
                className="border-b border-l border-border bg-muted/40 p-3 text-center text-sm font-semibold"
              >
                {formatDay(day)}
              </div>
            ))}
            {visibleTimeIndexes.map((index) => {
              const time = baseSlots[index]
              return (
                <div key={time} className="contents">
                  <div className="flex items-start justify-end border-r border-border p-1 text-[11px] text-muted-foreground">
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
      {saved && !adminMode && savedSlots.length > 0 && (
        <div className="mt-6 rounded-lg border border-border p-4">
          <h2 className="font-semibold">Add your availability to Google Calendar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These links combine adjacent 15-minute selections into larger events.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {getCalendarEvents().map((event) => (
              <a
                key={`${event.start.toISOString()}-${event.end.toISOString()}`}
                className="rounded border border-border px-3 py-2 text-sm text-primary underline hover:bg-muted"
                href={googleCalendarUrl(event)}
                target="_blank"
                rel="noreferrer"
              >
                {formatDay(event.start.toISOString().slice(0, 10))} ·{' '}
                {formatTime(event.start.toISOString())}–{formatTime(event.end.toISOString())}
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
