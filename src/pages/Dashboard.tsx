import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../auth/authContext.tsx';
import { useMembership } from '../auth/membershipContext.tsx';
import type { Club } from '../assets/types';
import type { Announcement } from '../assets/types';
import { formatAnnouncementDate } from '../assets/utils.ts';
import ClubCard from '../components/ClubCard';
import ClubCardSkeleton from '../components/ClubCardSkeleton';
import { fetchLatestAnnouncements } from '../services/clubs.ts';
import { fetchJoinedClubs } from '../services/clubs.ts';

const MAX_CLUBS = 5;

// Full class names (not built dynamically) so Tailwind can detect them.
const SCHOOL_BADGE: Record<string, string> = {
  soph: 'bg-soph-soft text-soph-dark',
  sobu: 'bg-sobu-soft text-sobu-dark',
  soed: 'bg-soed-soft text-soed-dark',
  soen: 'bg-soen-soft text-soen-dark',
  soas: 'bg-soas-soft text-soas-dark',
};
const DEFAULT_BADGE = 'bg-primary-soft text-primary';


function authorName(user: Announcement['user']) {
  return user ? `${user.first_name} ${user.last_name}` : '[DELETED USER]';
}

function AnnouncementSkeleton() {
  return (
    <div className="animate-pulse rounded-md border border-primary-soft bg-white p-4">
      <div className="h-4 w-24 rounded bg-primary-soft" />
      <div className="mt-3 h-4 w-2/3 rounded bg-primary-soft" />
      <div className="mt-2 h-3 w-full rounded bg-primary-soft" />
      <div className="mt-1 h-3 w-4/5 rounded bg-primary-soft" />
    </div>
  );
}

function Dashboard() {
  const { profile, loading: authLoading } = useAuth();
  const { memberships, loading: membershipsLoading } = useMembership();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clubIds = useMemo(() => Array.from(memberships.keys()), [memberships]);

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

  const clubsById = useMemo(() => {
    const map = new Map<string, Club>();
    clubs.forEach((club) => map.set(club.club_id, club));
    return map;
  }, [clubs]);


  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [joinedClubs, latest] = await Promise.all([
          fetchJoinedClubs(clubIds),
          fetchLatestAnnouncements(clubIds)
        ]);

        if (!cancelled) {
          setClubs(joinedClubs);
          setAnnouncements(latest);
        }
      } catch (err:any) {
        if (!cancelled) {
          setError(errorMessages[err.code] ?? errorMessages['generic']);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Wait for memberships to settle before deciding what to show.
    if (!membershipsLoading) {
      if (clubIds.length === 0) {
        setClubs([]);
        setAnnouncements([]);
        setLoading(false);
      } else {
        load();
      }
    }

    return () => {
      cancelled = true;
    };
  }, [membershipsLoading, clubIds]);

  // All hooks must run before this early return.

  if (membershipsLoading || authLoading || !profile) return <AnnouncementSkeleton />;

  const showLoading = membershipsLoading || loading;
  const hasClubs = clubIds.length > 0;

  return (
    <div>
      <div className="bg-primary-soft/50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="break-words text-2xl font-bold text-ink sm:text-3xl">
            Welcome back, {profile.first_name}
          </h1>
        </div>
      </div>
      <div className="h-1 w-full bg-primary" />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {error && (
          <div
            className="mb-6 flex items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
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

        {/* Latest announcements */}
        <section>
          <h2 className="text-lg font-bold text-ink">Latest Announcements</h2>

          <div className="mt-4 flex flex-col gap-3">
            {showLoading &&
              Array.from({ length: 2 }).map((_, i) => <AnnouncementSkeleton key={i} />)}

            {!showLoading &&
              announcements.map((announcement) => {
                const club = clubsById.get(announcement.club_id);
                const badgeClass =
                  SCHOOL_BADGE[club?.school.toLowerCase() ?? ''] ?? DEFAULT_BADGE;

                return (
                  <Link
                    key={announcement.id}
                    to={`/clubs/${announcement.club_id}/announcements`}
                    className="rounded-md border border-primary-soft bg-white p-4 transition-colors hover:border-primary"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {club ? (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}
                        >
                          {club.name}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-muted">
                        {formatAnnouncementDate(announcement.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-ink">{announcement.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{announcement.content}</p>
                    <p className="mt-2 text-xs text-muted">
                      Posted by {authorName(announcement.user)}
                    </p>
                  </Link>
                );
              })}

            {!showLoading && announcements.length === 0 && (
              <div className="rounded-md border-2 border-dashed border-primary-soft px-6 py-10 text-center">
                <FontAwesomeIcon icon={faBullhorn} className="text-3xl text-primary" />
                <p className="mt-3 text-sm font-semibold text-ink">No announcements yet</p>
                <p className="mt-1 text-sm text-muted">
                  {hasClubs
                    ? "Your clubs haven't posted anything yet."
                    : 'Join a club to see its announcements here.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Joined clubs */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-ink">Your Clubs</h2>
              {!membershipsLoading && (
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                  {memberships.size} of {MAX_CLUBS} MAX
                </span>
              )}
            </div>
            <Link
              to="/clubs"
              className="text-sm font-semibold text-primary transition-colors hover:text-accent"
            >
              Browse All Clubs
            </Link>
          </div>

          <div className="mt-4">
            {showLoading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <ClubCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!showLoading && clubs.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {clubs.map((club) => (
                  <ClubCard key={club.club_id} club={club} />
                ))}
              </div>
            )}

            {!showLoading && !hasClubs && (
              <div className="rounded-md border-2 border-dashed border-primary-soft px-6 py-10 text-center">
                <FontAwesomeIcon icon={faUsers} className="text-3xl text-primary" />
                <p className="mt-3 text-sm font-semibold text-ink">You haven't joined any clubs</p>
                <p className="mt-1 text-sm text-muted">
                  Find a club that fits your interests and join it.
                </p>
                <Link
                  to="/clubs"
                  className="mt-5 inline-block rounded-md bg-gradient-to-br from-accent to-accent-light px-4 py-2 text-sm font-bold text-ink shadow-md shadow-accent/20 transition-colors hover:from-accent-dark hover:to-accent"
                >
                  Browse Clubs
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;