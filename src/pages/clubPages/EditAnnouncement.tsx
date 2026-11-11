import { useState, type SubmitEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext.tsx'
import { updateAnnouncement } from '../../services/clubs.ts'
import type { Announcement } from '../../assets/types'

export default function EditAnnouncement() {

  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const stateAnnouncement = (location.state as { announcement: Announcement } | null)?.announcement

  const [title, setTitle] = useState(stateAnnouncement?.title ?? '')
  const [content, setContent] = useState(stateAnnouncement?.content ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const errorMessages: Record<string, string> = {
    '23505': 'This record already exists. Please contact us on email or whatsapp to fix this.',
    '23503': 'This record cannot be created because a related record does not exist. Please contact us on email or whatsapp to fix this.',
    '23502': 'A required field is missing. Please contact us on email or whatsapp to fix this.',
    '23514': 'The provided data is invalid. Please contact us on email or whatsapp to fix this.',
    '22P02': 'The provided data has an invalid format.',
    '22001': 'The provided value is too long. Please contact us on email or whatsapp to fix this.',
    '42501': 'You do not have permission to perform this action. Please contact us on email or whatsapp to fix this.',
    'PGRST116': 'The requested record was not found.',
    'generic': 'Something went wrong. Please try again.'
  }

  if (!stateAnnouncement) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-sm text-muted">No announcement passed to edit!!!!</p>
      </div>
    )
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    if (!profile || !stateAnnouncement) return

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle) {
      setError('A title for the announcement is required.')
      return;
    }

    setSubmitting(true)
    setError(null)
    try {
      await updateAnnouncement(stateAnnouncement.id, trimmedTitle, trimmedContent)
      navigate(-1)
    } catch (err: any) {
      setError(errorMessages[err.code] ?? errorMessages['generic'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
      <h2 className="text-lg font-bold text-ink">Edit Announcement</h2>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-semibold text-ink">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          className="w-full rounded-md border border-primary-soft px-3 py-2 text-sm text-ink focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-semibold text-ink">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full resize-y rounded-md border border-primary-soft px-3 py-2 text-sm text-ink focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border border-primary-soft px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}