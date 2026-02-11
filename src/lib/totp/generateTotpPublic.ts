import { TOTP } from 'otpauth'

/**
 * Generates a TOTP code for a given secret key
 * This is used by the external QR code application
 * @param secret - Base32-encoded secret string
 * @param period - Time step in seconds (default: 10 seconds to match your requirement)
 * @param timestamp - Optional timestamp in milliseconds (defaults to current time)
 * @returns The current TOTP code (12-digit string)
 */
export function generateTotpPublic(secret: string, period: number = 10, timestamp?: number): string {
  const totp = new TOTP({
    issuer: 'PorgUNC',
    label: 'Poll',
    algorithm: 'SHA1',
    digits: 10,
    period: period, // new code each period
    secret: secret,
  })

  return timestamp !== undefined ? totp.generate({ timestamp }) : totp.generate()
}

/**
 * Generates a TOTP URI for QR code generation
 * @param secret - Base32-encoded secret string
 * @param label - Label for the TOTP (e.g., form name)
 * @param period - Time step in seconds (default: 10 seconds)
 * @returns TOTP URI string that can be encoded in a QR code
 */
export function generateTotpUri(secret: string, label: string = 'Poll', period: number = 10): string {
  const totp = new TOTP({
    issuer: 'PorgUNC',
    label: label,
    algorithm: 'SHA1',
    digits: 10,
    period: period,
    secret: secret,
  })

  return totp.toString()
}
