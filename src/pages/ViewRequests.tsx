// pages/ClubRequests.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/authContext.tsx';
import { fetchClubRequests } from '../services/clubs.ts';
import type { ClubRequest } from '../assets/types.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function formatRequestDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ClubRequests() {
  const { profile } = useAuth();

  const [requests, setRequests] = useState<ClubRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true)

      try {
        const data = await fetchClubRequests();
        setRequests(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-sm text-muted">Not that easy haha. This page is protected at the database level too, but nice try.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-primary px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-white">Club Requests</h1>
        </div>
      </div>
      <div className="h-1 w-full bg-accent" />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <div className="mb-4 flex items-center justify-between rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-md border border-primary-soft p-5">
                <div className="h-4 w-1/3 rounded bg-primary-soft" />
                <div className="mt-3 h-3 w-2/3 rounded bg-primary-soft" />
                <div className="mt-2 h-3 w-1/2 rounded bg-primary-soft" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <p className="text-sm text-muted">No pending club requests.</p>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-4">
            {requests.map((req) => (
              <div key={req.id} className="rounded-md border border-primary-soft p-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-ink">{req.title}</h2>
                  <span className="whitespace-nowrap text-xs text-muted">
                    {formatRequestDate(req.created_at)}
                  </span>
                </div>

                <p className="mt-2 text-sm text-ink">{req.description}</p>

                {req.notes && (
                  <p className="mt-2 text-sm italic text-muted">Notes: {req.notes}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-primary-soft pt-3 text-xs text-muted">
                  <span>
                    {req.user
                      ? `${req.user.first_name} ${req.user.middle_name ? req.user.middle_name + ' ' : ''}${req.user.last_name}`
                      : 'Unknown user'}
                  </span>
                  <span>email: {req.user?.email ?? '—'}</span>
                  <span>phone: {req.phone_number}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubRequests;