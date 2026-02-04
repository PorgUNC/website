'use client'
import React, { useEffect, useState } from 'react'

interface TotpTimerProps {
  token: string
  validDuration: number // in minutes
  period?: number // in seconds, default 10
  tokenGeneratedAt: number // timestamp in seconds when token was generated
  onExpired?: () => void
}

export const TotpTimer: React.FC<TotpTimerProps> = ({
  token,
  validDuration,
  period = 10,
  tokenGeneratedAt,
  onExpired,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    // Calculate expiration time based on when the token was generated
    // tokenGeneratedAt is in seconds, convert to milliseconds
    const tokenIssuedTime = tokenGeneratedAt * 1000 // in milliseconds
    const expirationTime = tokenIssuedTime + validDuration * 60 * 1000

    const updateTimer = () => {
      const remaining = expirationTime - Date.now()

      if (remaining <= 0) {
        setTimeRemaining(0)
        setIsExpired(true)
        if (onExpired) {
          onExpired()
        }
      } else {
        setTimeRemaining(remaining)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 100) // Update every 100ms for smooth countdown

    return () => clearInterval(interval)
  }, [token, validDuration, period, tokenGeneratedAt, onExpired])

  if (timeRemaining === null) {
    return null
  }

  const minutes = Math.floor(timeRemaining / 60000)
  const seconds = Math.floor((timeRemaining % 60000) / 1000)
  // const milliseconds = Math.floor((timeRemaining % 1000) / 10)

  const getTimerColor = () => {
    if (isExpired) return 'text-red-600'
    if (timeRemaining < 60000) return 'text-orange-600' // Less than 1 minute
    return 'text-green-600'
  }

  return (
    <div className="mb-6 p-4 border border-border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Time Remaining:</span>
        <span className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
          {isExpired ? (
            'EXPIRED'
          ) : (
            <>
              {minutes.toString().padStart(2, '0')}:
              {seconds.toString().padStart(2, '0')}
              {/*.{milliseconds.toString().padStart(2, '0')}*/}
            </>
          )}
        </span>
      </div>
      {isExpired && (
        <p className="text-sm text-red-600 mt-2">
          This form token has expired. Please request a new QR code.
        </p>
      )}
    </div>
  )
}
