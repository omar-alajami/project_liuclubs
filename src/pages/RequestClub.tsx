import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../auth/authContext.tsx';
import { submitClubRequest } from '../services/clubs.ts';


const TITLE_MAX = 100;
const DESCRIPTION_MAX = 1000;
const NOTES_MAX = 500;
const PHONE_MIN = 7;
const PHONE_MAX = 15;

const fieldClass =
  'w-full rounded-md border border-primary-soft bg-white text-sm text-ink placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent';
const labelClass = 'mb-1 block text-sm font-semibold text-ink';


function RequestClub() {
  const { profile, loading } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return null;

  if (!profile) return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-md border-2 border-dashed border-primary-soft px-6 py-10 text-center">
        <p className="mt-3 text-sm font-semibold text-ink">You're not logged in</p>
        <p className="mt-1 text-sm text-muted">
          Log in to request a new club.
        </p>
        <Link
          to="/login"
          className="mt-5 inline-block rounded-md bg-gradient-to-br from-accent to-accent-light px-4 py-2 text-sm font-bold text-ink shadow-md shadow-accent/20 transition-colors hover:from-accent-dark hover:to-accent"
        >
          Log In
        </Link>
      </div>
    </div>
  )

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!profile) return;

    setError(null);

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedNotes = notes.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setError('Please fill in the Title and Description.');
      return;
    }

    if (trimmedPhone.length < PHONE_MIN || trimmedPhone.length > PHONE_MAX) {
      setError('Invalid Phone Number');
      return;
    }

    setSubmitting(true);

    try {
      await submitClubRequest({
        user_id: profile.id,
        title: trimmedTitle,
        description: trimmedDescription,
        notes: trimmedNotes || undefined,
        phone_number: trimmedPhone,
      });
      setSubmitted(true);
    } catch (err:any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="bg-primary px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-white">Create your own club!</h1>
          <p className="mt-2 text-sm text-white/70">
            Tell us about the club you'd like to start. We'll review your request and reach out about next steps.
          </p>
        </div>
      </div>
      <div className="h-1 w-full bg-accent" />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {submitted ? (
          <div className="max-w-2xl mx-auto rounded-md border-2 border-dashed border-primary-soft px-6 py-10 text-center">
            <FontAwesomeIcon icon={faCircleCheck} className="text-4xl text-primary" />
            <h2 className="mt-4 text-lg font-bold text-ink">Request sent</h2>
            <p className="mt-1 text-sm text-muted">
              Your request to start a club has been sent for review.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/home"
                className="rounded-md bg-gradient-to-br from-accent to-accent-light px-4 py-2 text-sm font-bold text-ink shadow-md shadow-accent/20 transition-colors hover:from-accent-dark hover:to-accent"
              >
                Go to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {error && (
              <div className="mb-4 flex items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  aria-label="Dismiss error"
                  className="flex-shrink-0 text-red-700 hover:text-red-900"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="title" className={labelClass}>Club Name</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={TITLE_MAX}
                  required
                  placeholder="Enter club title..."
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={DESCRIPTION_MAX}
                  required
                  rows={6}
                  placeholder="What will the club do? Who is it for? etc."
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  minLength={PHONE_MIN}
                  maxLength={PHONE_MAX}
                  required
                  placeholder="e.g. 76353348"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="notes" className={labelClass}>Additional Notes (optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={NOTES_MAX}
                  rows={3}
                  placeholder="Anything else you'd like to add..."
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-gradient-to-br from-accent to-accent-light px-4 py-2 text-sm font-bold text-ink shadow-md shadow-accent/20 transition-colors hover:from-accent-dark hover:to-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
              <Link
                to="/home"
                className="rounded-md border border-primary-soft px-4 py-2 text-center text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RequestClub;