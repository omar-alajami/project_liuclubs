import { useEffect, useState } from 'react'
import { useParams, useLocation, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { fetchClubById } from '../services/clubs.ts'
import { joinClub } from '../services/clubs.ts'
import { leaveClub } from '../services/clubs.ts'
import type { Club } from '../assets/types.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn, faUsers, faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useMembership } from '../auth/membershipContext.tsx'
import { useAuth } from '../auth/authContext.tsx'

const SCHOOL_INFO: Record<string, { label: string; badgeClass: string }> = {
  SoPH: { label: 'School of Pharmacy', badgeClass: 'bg-soph-soft text-soph-dark' },
  SoBU: { label: 'School of Business', badgeClass: 'bg-sobu-soft text-sobu-dark' },
  SoED: { label: 'School of Education', badgeClass: 'bg-soed-soft text-soed-dark' },
  SoEN: { label: 'School of Engineering', badgeClass: 'bg-soen-soft text-soen-dark' },
  SoAS: { label: 'School of Arts & Sciences', badgeClass: 'bg-soas-soft text-soas-dark' },
}

export type ClubContext = { club: Club, privUser: boolean, allowUser: boolean, superUser: boolean }

export default function ClubLayoutWrapper() {
  const { clubId } = useParams<{ clubId: string }>();
  return (<ClubLayout key={clubId} />);
}

function ClubLayout() {

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


  const { clubId } = useParams<{ clubId: string }>();
  const location = useLocation();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { refetchMemberships, isMember, memberships, loading:membershipsLoading } = useMembership();

  const stateClub = (location.state as { club?: Club } | null)?.club ?? null

  const [logoSrc, setLogoSrc] = useState(`/clubs/${stateClub?.club_id}/logo.png`);
  const [heroSrc, setHeroSrc] = useState(`/clubs/${stateClub?.club_id}/hero.png`);

  const [club, setClub] = useState<Club | null>(stateClub);
  const [loading, setLoading] = useState(!stateClub);
  const [joinLoading, setJoinLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [newError, setNewError] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const allowUser = (isMember(club?.club_id ?? '') || profile?.role === 'admin');
  const privUser = (profile?.role === 'admin' || memberships.get(club?.club_id ?? '') === "moderator" || memberships.get(club?.club_id ?? '')  === "president");
  const superUser = (profile?.role === 'admin' || memberships.get(club?.club_id ?? '') === "president");

  async function handleJoinClub(){
    
    if (!profile) {
      navigate('/login');
      return;
    }

    if (memberships.size >= 5) {
      alert("You can't be a member in 5 clubs simultaneously! You can leave one of your other clubs to join.");
      return;
    }

    setJoinLoading(true);
    setNewError('');
    try {

      await joinClub(club?.club_id ?? '', profile?.id ?? '');
      await refetchMemberships();
      setClub((prev) => (prev ? { ...prev, member_count: prev.member_count + 1 } : prev))

    } catch (err:any){

      setNewError(err.message);

    } finally{
      setJoinLoading(false);
    }
  }
  async function handleLeaveClub(){
    
    const confirmed = window.confirm(`Are you sure you want to leave ${club?.name}?`)
    if (!confirmed) return;
    
    setLeaveLoading(true);
    setNewError('');
    try{

      await leaveClub(club?.club_id ?? '', profile?.id ?? '');
      await refetchMemberships();
      setClub((prev) => (prev ? { ...prev, member_count: prev.member_count - 1 } : prev));

    } catch (err:any){

      setNewError(errorMessages[err.code] ?? errorMessages['generic']);

    } finally{
      setLeaveLoading(false);
    }

  }

  //load club if not passed through card.
  useEffect(() => {
    if (club || !clubId) return;

    const loadClub = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetched = await fetchClubById(clubId)
        setClub(fetched)
        setLogoSrc(`/clubs/${fetched.club_id}/logo.png`)
        setHeroSrc(`/clubs/${fetched.club_id}/hero.png`)
      } catch (err: any) {
        setError(errorMessages[err.code] ?? errorMessages['generic'])
      } finally {
        setLoading(false)
      }
    }
    loadClub();
  }, [clubId, club]);

  if (loading || membershipsLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="h-56 w-full animate-pulse rounded-xl bg-primary-soft sm:h-72" />
        <div className="mt-6 h-6 w-1/3 animate-pulse rounded bg-primary-soft" />
        <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-primary-soft" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-red-600">Failed to load club: {error}</p>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-muted">Club not found.</p>
      </div>
    )
  }

  const schoolInfo = SCHOOL_INFO[club.school]

  return (
    <div>
      {/* Hero */}
      <div className="relative h-56 w-full overflow-hidden sm:h-80">
        <img
          src={heroSrc}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setHeroSrc('/clubs/default_hero.png')} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-4 px-4 pb-4 sm:px-8 sm:pb-6">
          <img
            src={logoSrc}
            alt={`${club.name} logo`}
            className="h-20 w-20 flex-shrink-0 rounded-xl border-2 border-white bg-white object-contain shadow-md sm:h-24 sm:w-24"
            onError={() => setLogoSrc('/clubs/default_logo.png')} 
          />
          <div className="min-w-0"> 
            <h1 className="truncate text-xl font-bold text-white sm:text-3xl">{club.name}</h1> 
            <p className="mt-1 line-clamp-3 max-w-2xl text-sm text-white/80 sm:text-base">
              {club.short_description} 
            </p>
          </div>
        </div>
      </div>

      {/* School + category strip */}
      <div className="border-b border-primary-soft bg-white px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {schoolInfo ? (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${schoolInfo.badgeClass}`}>
                {schoolInfo.label}
              </span>
            ) : (
              <span className="rounded-full border-2 border-dashed border-red-400 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                Unknown school: {club.school}
              </span>
            )}

            {club.categories.map((cat) => (
              <span key={cat} className="rounded-full bg-muted/10 px-3 py-0.5 text-[11px] font-semibold text-muted">
                {cat}
              </span>
            ))}
          </div>

          <div className="flex flex-shrink-0 items-center gap-3">
            <span className="text-xs font-semibold text-muted">
              {club.member_count} {club.member_count === 1 ? 'Member' : 'Members'}
            </span>

            {!isMember(club.club_id) ? (
              <button
                onClick={handleJoinClub}
                disabled={joinLoading}
                className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {joinLoading ? 'Joining...' : 'Join Club'}
              </button>
            ): (
              <button
                onClick={handleLeaveClub}
                disabled={leaveLoading}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {leaveLoading ? 'Leaving...' : 'Leave Club'}
              </button>
            )}
          </div>
        </div>
      </div>

      {(newError) && (
        <div className="flex items-center justify-center gap-3 border-b border-red-200 bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-700 sm:px-8">
          <span>{newError}</span>
          <button
            onClick={() => {
              setNewError('')
            }}
            aria-label="Dismiss error"
            className="flex-shrink-0 rounded p-1 text-red-700 hover:bg-red-100"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        </div>
      )}

      {/* Club sub-nav */} 
      <div className="sticky top-16 z-40 border-b border-primary-soft bg-white"> 
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-8">
          <SubNavLink to="" icon={faCircleInfo} label="About" end />
          {allowUser && <SubNavLink to="announcements" icon={faBullhorn} label="Announcements" />}
          {allowUser && <SubNavLink to="members" icon={faUsers} label="Members" />}
        </div>
      </div>

      {/* Tab content — receives { club } via useOutletContext<ClubContext>() */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <Outlet context={{ club, allowUser, privUser, superUser } satisfies ClubContext} />
      </div>
    </div>
  )
}

function SubNavLink({
  to,
  icon,
  label,
  end,
}: {
  to: string
  icon: any
  label: string
  end?: boolean 
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-shrink-0 items-center gap-2 border-b-[3px] px-4 py-3 text-sm font-semibold transition-colors ${
          isActive ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'
        }`
      }
      replace
    >
      <FontAwesomeIcon icon={icon} />
      {label}
    </NavLink>
  )
}
