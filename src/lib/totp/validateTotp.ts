import { TOTP } from 'otpauth'

/**
 * Validates a TOTP code against a secret key
 * @param token - The TOTP code to validate (6-digit string)
 * @param secret - Base32-encoded secret string
 * @param validDuration - Valid duration in minutes (used to calculate window)
 * @param period - Time step in seconds (default: 10 seconds)
 * @returns boolean indicating if the token is valid
 */
export function validateTotp(
  token: string,
  secret: string,
  validDuration: number,
  period: number = 10
): boolean {
  const totp = new TOTP({
    issuer: 'PorgUNC',
    label: 'Poll',
    algorithm: 'SHA1',
    digits: 6,
    period: period, // 10 seconds
    secret: secret,
  })

  // Calculate the window based on validDuration
  // validDuration is in minutes, period is in seconds
  // window = number of periods in the valid duration
  const windowSize = Math.ceil((validDuration * 60) / period)

  // Validate the token with the calculated window
  // This allows tokens from [now - window*period, now + window*period]
  const delta = totp.validate({
    token: token,
    window: windowSize,
  })

  // If delta is not null, the token is valid
  return delta !== null
}

/**
 * Validates a TOTP code and returns the time delta
 * @param token - The TOTP code to validate (6-digit string)
 * @param secret - Base32-encoded secret string
 * @param validDuration - Valid duration in minutes (used to calculate window)
 * @param period - Time step in seconds (default: 10 seconds)
 * @returns number | null - The time delta if valid, null if invalid
 */
export function validateTotpWithDelta(
  token: string,
  secret: string,
  validDuration: number,
  period: number = 10
): number | null {
  const totp = new TOTP({
    issuer: 'PorgUNC',
    label: 'Poll',
    algorithm: 'SHA1',
    digits: 6,
    period: period,
    secret: secret,
  })

  const windowSize = Math.ceil((validDuration * 60) / period)

  return totp.validate({
    token: token,
    window: windowSize,
  })
}
