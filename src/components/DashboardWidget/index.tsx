'use client'

import React, { useState, useEffect } from 'react'
import './index.scss'

interface Form {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

const baseClass = 'dashboard-widget'

const DashboardWidget: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sharedDriveUrl = process.env.NEXT_PUBLIC_SHARED_DRIVE_URL || ''

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/forms?limit=5&depth=0&sort=-updatedAt')
        if (!response.ok) {
          setError('Failed to fetch forms')
          return
        }
        const data = await response.json()
        setForms(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])


  const getFormSubmissionsUrl = (formId: string) => {
    return `/admin/collections/form-submissions?limit=10&where[or][0][and][0][form][equals]=${formId}&page=1`
  }

  const getExportCsvUrl = (formId: string) => {
    return `/api/custom/forms/${formId}/export-csv`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__header`}>
        <h2 className={`${baseClass}__title`}>Quick Actions</h2>
      </div>

      <div className={`${baseClass}__actions`}>
        <a
          href="/admin/collections/polls/create"
          className={`${baseClass}__action-button ${baseClass}__action-button--poll`}
        >
          <svg className={`${baseClass}__icon`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <div className={`${baseClass}__action-content`}>
            <span className={`${baseClass}__action-title`}>New Poll</span>
            <span className={`${baseClass}__action-desc`}>Create a new poll post</span>
          </div>
        </a>

        <a
          href="/admin/collections/posts/create"
          className={`${baseClass}__action-button ${baseClass}__action-button--news`}
        >
          <svg className={`${baseClass}__icon`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <div className={`${baseClass}__action-content`}>
            <span className={`${baseClass}__action-title`}>New News Post</span>
            <span className={`${baseClass}__action-desc`}>Create a news article</span>
          </div>
        </a>

        <a
          href="/admin/collections/forms/create"
          className={`${baseClass}__action-button ${baseClass}__action-button--form`}
        >
          <svg className={`${baseClass}__icon`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className={`${baseClass}__action-content`}>
            <span className={`${baseClass}__action-title`}>New Form</span>
            <span className={`${baseClass}__action-desc`}>Create a new form</span>
          </div>
        </a>

        {sharedDriveUrl && (
          <a
            href={sharedDriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${baseClass}__action-button ${baseClass}__action-button--drive`}
          >
            <svg className={`${baseClass}__icon`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <div className={`${baseClass}__action-content`}>
              <span className={`${baseClass}__action-title`}>Shared Drive</span>
              <span className={`${baseClass}__action-desc`}>Access shared files</span>
            </div>
          </a>
        )}

        <a
          href="/admin/account"
          className={`${baseClass}__action-button ${baseClass}__action-button--settings`}
        >
          <svg className={`${baseClass}__icon`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className={`${baseClass}__action-content`}>
            <span className={`${baseClass}__action-title`}>User Settings</span>
            <span className={`${baseClass}__action-desc`}>Manage your account</span>
          </div>
        </a>
      </div>

      <div className={`${baseClass}__forms-section`}>
        <div className={`${baseClass}__section-header`}>
          <h3 className={`${baseClass}__section-title`}>Latest Forms</h3>
        </div>

        {loading && (
          <div className={`${baseClass}__loading`}>Loading forms...</div>
        )}

        {error && (
          <div className={`${baseClass}__error`}>Error: {error}</div>
        )}

        {!loading && !error && forms.length === 0 && (
          <div className={`${baseClass}__empty`}>No forms available yet.</div>
        )}

        {!loading && !error && forms.length > 0 && (
          <div className={`${baseClass}__forms-list`}>
            {forms.map((form) => (
              <div key={form.id} className={`${baseClass}__form-item`}>
                <div className={`${baseClass}__form-info`}>
                  <a
                    href={`/admin/collections/forms/${form.id}`}
                    className={`${baseClass}__form-title`}
                  >
                    {form.title}
                  </a>
                  <div className={`${baseClass}__form-meta`}>
                    <span className={`${baseClass}__form-id`}>ID: {form.id}</span>
                    <span className={`${baseClass}__form-date`}>
                      Updated: {formatDate(form.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className={`${baseClass}__form-actions`}>
                  <a
                    href={getFormSubmissionsUrl(form.id)}
                    className={`${baseClass}__form-button`}
                    title="View submissions"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>View Submissions</span>
                  </a>
                  <a
                    href={getExportCsvUrl(form.id)}
                    className={`${baseClass}__form-button ${baseClass}__form-button--export`}
                    title="Export submissions as CSV"
                    download
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export CSV</span>
                  </a>
                  <a
                    href={`/admin/collections/forms/${form.id}`}
                    className={`${baseClass}__form-button ${baseClass}__form-button--secondary`}
                    title="Edit form"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${baseClass}__footer`}>
        <div className={`${baseClass}__stats`}>
          <span className={`${baseClass}__stat`}>
            Showing <strong>{forms.length}</strong> most recent {forms.length === 1 ? 'form' : 'forms'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DashboardWidget
