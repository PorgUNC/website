import { Secret } from 'otpauth'

/**
 * Generates a new TOTP secret key for a form/poll
 * @returns Base32-encoded secret string
 */
export function generateTotpSecret(): string {
  const secret = new Secret({ size: 50 })
  return secret.base32
}
