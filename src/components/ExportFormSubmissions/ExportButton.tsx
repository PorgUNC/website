'use client'

import { useConfig, useDocumentInfo } from '@payloadcms/ui'
import React, { useState } from 'react'

export const ExportFormSubmissionsButton: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { config } = useConfig()
  const { id } = useDocumentInfo()

  const handleExport = async () => {
    if (!id) {
      setError('Form ID not found')
      return
    }

    setIsExporting(true)
    setError(null)

    try {
      const response = await fetch(`${config.serverURL}/api/forms/${id}/export-csv`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to export' }))
        throw new Error(errorData.error || 'Failed to export submissions')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `form-${id}-submissions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Export error:', err)
      setError(err instanceof Error ? err.message : 'Failed to export submissions')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting || !id}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: isExporting || !id ? '#6b7280' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isExporting || !id ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s',
        }}
      >
        {isExporting ? 'Exporting...' : 'Export CSV'}
      </button>
      {error && (
        <div style={{ color: '#dc2626', fontSize: '12px' }}>
          {error}
        </div>
      )}
    </div>
  )
}
