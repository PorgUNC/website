export const POLL_START_HOUR = 9
export const POLL_END_HOUR = 19
export const POLL_INTERVAL_MINUTES = 15

export function getPollDays(startDate: string, endDate: string): string[] {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days: string[] = []

  for (
    const date = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
    );
    date <= end;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    days.push(date.toISOString().slice(0, 10))
  }

  return days
}

export function getPollWeekdays(startDate: string, endDate: string): string[] {
  return getPollDays(startDate, endDate).filter((day) => {
    const weekday = new Date(`${day}T12:00:00Z`).getUTCDay()
    return weekday !== 0 && weekday !== 6
  })
}

export function getDaySlots(day: string): string[] {
  const [year, month, date] = day.split('-').map(Number)
  const slots: string[] = []

  const getEasternOffset = (value: Date) => {
    const timeZoneName = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      timeZoneName: 'shortOffset',
    })
      .formatToParts(value)
      .find((part) => part.type === 'timeZoneName')?.value
    const match = timeZoneName?.match(/GMT([+-])(\d+)(?::(\d+))?/)
    if (!match) return -5 * 60
    return (match[1] === '+' ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3] ?? 0))
  }

  for (
    let minutes = POLL_START_HOUR * 60;
    minutes < POLL_END_HOUR * 60;
    minutes += POLL_INTERVAL_MINUTES
  ) {
    const wallClock = new Date(
      Date.UTC(year, month - 1, date, Math.floor(minutes / 60), minutes % 60),
    )
    slots.push(
      new Date(wallClock.getTime() - getEasternOffset(wallClock) * 60 * 1000).toISOString(),
    )
  }

  return slots
}

export function getPollSlots(startDate: string, endDate: string): string[] {
  return getPollWeekdays(startDate, endDate).flatMap(getDaySlots)
}
