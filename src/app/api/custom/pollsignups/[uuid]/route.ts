import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import type { Polltime } from '@/payload-types'
import { getPollSlots } from '@/lib/pollTimes'
import type { User } from '@/payload-types'
import { checkRole } from '@/collections/Users/access/checkRole'

type RouteContext = { params: Promise<{ uuid: string }> }

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

async function findPoll(uuid: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'polltimes',
    limit: 1,
    pagination: false,
    where: { uuid: { equals: uuid } },
  })

  return { payload, poll: result.docs[0] as Polltime | undefined }
}

export async function GET(request: Request, { params }: RouteContext) {
  const { uuid } = await params
  const { poll, payload } = await findPoll(uuid)

  if (!poll) return error('Poll not found', 404)

  const { user } = await payload.auth({ headers: request.headers })
  const pollSlots = new Set(getPollSlots(poll.startDate, poll.endDate))
  const isAdmin = checkRole(['admin'], user as User)
  const adminSlots = isAdmin
    ? [
        ...new Set(
          (poll.execTimes ?? [])
            .filter((entry) => {
              const entryUser = entry.people.user
              return (typeof entryUser === 'number' ? entryUser : entryUser.id) === user?.id
            })
            .flatMap((entry) => entry.people.times ?? [])
            .map((entry) => entry.timeanddate),
        ),
      ].sort()
    : []
  const availableSlots = [
    ...new Set(
      (poll.execTimes ?? [])
        .flatMap((entry) => entry.people.times ?? [])
        .map((entry) => entry.timeanddate)
        .filter((slot) => pollSlots.has(slot)),
    ),
  ].sort()
  const executives = (poll.execTimes ?? []).map((entry) => {
    const executive = entry.people.user
    return {
      name:
        typeof executive === 'number'
          ? `Executive ${executive}`
          : typeof executive === 'object' && executive?.name
            ? executive.name
            : 'Executive',
      slots: (entry.people.times ?? []).map((slot) => slot.timeanddate),
    }
  })
  const currentSignup = (poll.regularTimes ?? []).find((entry) => {
    const entryUser = entry.people.user
    return user ? (typeof entryUser === 'number' ? entryUser : entryUser?.id) === user.id : false
  })

  return NextResponse.json({
    startDate: poll.startDate,
    endDate: poll.endDate,
    additionalInfo: poll.additionalInfo ?? null,
    availableSlots,
    signups: (poll.regularTimes ?? []).map((entry) => ({
      name: entry.people.name,
      slots: (entry.people.times ?? []).map((slot) => slot.timeanddate),
      userId: typeof entry.people.user === 'number' ? entry.people.user : entry.people.user?.id,
    })),
    currentUserName: user && typeof user.name === 'string' ? user.name : null,
    currentUserSlots: currentSignup?.people.times?.map((slot) => slot.timeanddate) ?? [],
    isAdmin,
    adminSlots,
    executives,
  })
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { uuid } = await params
    const { poll, payload } = await findPoll(uuid)
    if (!poll) return error('Poll not found', 404)

    const { user } = await payload.auth({ headers: request.headers })
    if (!user || !checkRole(['admin'], user as User)) return error('Admin access required.', 403)

    const body = await request.json()
    if (!Array.isArray(body.slots)) return error('Invalid executive availability.')

    const pollSlots = new Set(getPollSlots(poll.startDate, poll.endDate))
    const slots = [...new Set(body.slots)].filter(
      (slot): slot is string => typeof slot === 'string' && pollSlots.has(slot),
    )
    if (slots.length !== body.slots.length)
      return error('Executive times must be weekday slots between 9 AM and 7 PM.')

    const execTimes = (poll.execTimes ?? []).filter((entry) => {
      const entryUser = entry.people.user
      return (typeof entryUser === 'number' ? entryUser : entryUser.id) !== user.id
    })
    execTimes.push({
      people: {
        user: user.id,
        times: slots.map((timeanddate) => ({ timeanddate })),
      },
    })

    await payload.update({
      collection: 'polltimes',
      id: poll.id,
      data: { execTimes },
      overrideAccess: true,
    })

    const availableSlots = [
      ...new Set(
        execTimes
          .flatMap((entry) => entry.people.times ?? [])
          .map((entry) => entry.timeanddate)
          .filter((slot) => pollSlots.has(slot)),
      ),
    ].sort()

    return NextResponse.json({ message: 'Executive availability saved.', availableSlots })
  } catch (caughtError) {
    console.error('Error saving executive poll times:', caughtError)
    return error('Unable to save executive availability right now.', 500)
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { uuid } = await params
    const body = await request.json()
    const requestedName = typeof body.name === 'string' ? body.name.trim() : ''
    const requestedSlots = Array.isArray(body.slots) ? body.slots : null

    if (!requestedSlots || requestedSlots.length === 0) {
      return error('Select at least one available time.')
    }

    const { poll, payload } = await findPoll(uuid)
    if (!poll) return error('Poll not found', 404)

    const { user } = await payload.auth({ headers: request.headers })
    const name = user && typeof user.name === 'string' ? user.name.trim() : requestedName
    if (!name || name.length > 100)
      return error('A name is required and must be 100 characters or fewer.')

    const pollSlots = new Set(getPollSlots(poll.startDate, poll.endDate))
    const executiveSlots = new Set(
      (poll.execTimes ?? []).flatMap((entry) =>
        (entry.people.times ?? []).map((slot) => slot.timeanddate),
      ),
    )
    const slots = [...new Set(requestedSlots)].filter(
      (slot): slot is string =>
        typeof slot === 'string' && pollSlots.has(slot) && executiveSlots.has(slot),
    )

    if (slots.length !== requestedSlots.length) {
      return error('One or more selected times are not available for this poll.')
    }

    const regularTimes = (poll.regularTimes ?? []).filter((entry) => {
      const entryUser = entry.people.user
      const matchesUser = user
        ? (typeof entryUser === 'number' ? entryUser : entryUser?.id) === user.id
        : false
      return !matchesUser && (user || entry.people.name.trim().toLowerCase() !== name.toLowerCase())
    })
    regularTimes.push({
      people: {
        name,
        ...(user ? { user: user.id } : {}),
        times: slots.map((timeanddate) => ({ timeanddate })),
      },
    })

    await payload.update({
      collection: 'polltimes',
      id: poll.id,
      data: { regularTimes },
      overrideAccess: true,
    })

    return NextResponse.json({ message: 'Availability saved.' })
  } catch (caughtError) {
    console.error('Error saving poll signup:', caughtError)
    return error('Unable to save availability right now.', 500)
  }
}
