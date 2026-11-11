import { useEffect, useState } from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { ClubContext } from '../ClubLayout.tsx';
import { fetchClubAnnouncements } from '../../services/clubs.ts';
import type { Announcement } from '../../assets/types.tsx';
import AnnouncementCard from '../../components/AnnouncementCard.tsx';
import AnnouncementCardSkeleton from '../../components/AnnouncementCardSkeleton.tsx';

const PAGE_SIZE = 5;

export default function ClubAnnouncements() {
  const { club, privUser, allowUser } = useOutletContext<ClubContext>();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    let cancelled = false

    async function loadFirstPage() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchClubAnnouncements(club.club_id)
        if (cancelled) return
        setAnnouncements(data)
        setHasMore(data.length === PAGE_SIZE)
      } catch (err: any) {
        if (!cancelled) setError(errorMessages[err.code] ?? errorMessages['generic'])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadFirstPage()
    return () => { cancelled = true }
  }, [club.club_id])

  async function handleLoadMore() {
    const cursor = announcements[announcements.length - 1]?.created_at
    if (!cursor) return

    setLoadingMore(true)
    setLoadMoreError(null)
    try {
      const data = await fetchClubAnnouncements(club.club_id, cursor)
      setAnnouncements((prev) => [...prev, ...data])
      setHasMore(data.length === PAGE_SIZE)
    } catch (err: any) {
      setLoadMoreError(errorMessages[err.code] ?? errorMessages['generic'])
    } finally {
      setLoadingMore(false)
    }
  }

  function handleAnnouncementDeleted(annId: string) {
    setAnnouncements(prev => {
      const updated = prev.filter(ann => ann.id !== annId);
      // If no announcements are left in the current view, 
      // disable "Load More" since we no longer have a valid cursor.
      if (updated.length === 0) {
        setHasMore(false);
      }
      
      return updated;
    });
  };

  useEffect(() => {
    if (!allowUser) {
      navigate(`/clubs/${club.club_id}`, { replace: true });
    }
  }, [allowUser, club.club_id, navigate]);

  if (!allowUser) {
    return null;
  }


  return (
    <div className="space-y-4">
      {privUser && !loading && !error && (
        <div className="flex justify-end">
          <Link
            to={`/clubs/${club.club_id}/announcements/new`}
            className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-accent-dark"
          >
            + New Announcement
          </Link>
        </div>
      )}

      {loading && (
        <div className="space-y-4 lg:max-w-3xl lg:mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <AnnouncementCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-600">Failed to load announcements: {error}</p>
      )}

      {!loading && !error && announcements.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary-soft py-16 text-center">
          <FontAwesomeIcon icon={faBullhorn} className="text-3xl text-primary-soft" />
          <p className="text-sm font-semibold text-muted">No announcements yet</p>
        </div>
      )}

      {!loading && !error && announcements.length > 0 && (
        <>
          <div className="lg:max-w-3xl lg:mx-auto" >
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} onDelete={handleAnnouncementDeleted}/>
            ))}
          </div>
          {hasMore && (
            <div className="flex flex-col items-center gap-2 pt-2">
              {loadMoreError && (
                <p className="text-sm text-red-600">{loadMoreError}</p>
              )}
              {loadingMore ? (
                <FontAwesomeIcon icon={faSpinner} spin className="text-xl text-primary" />
              ) : (
                <button
                  onClick={() => handleLoadMore()}
                  className="rounded-md border border-primary-soft px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}