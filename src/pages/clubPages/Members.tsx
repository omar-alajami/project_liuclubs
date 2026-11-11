import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import type { ClubContext } from '../ClubLayout.tsx';
import { fetchClubMembers, promoteMemberToModerator, demoteModeratorToMember, removeUserFromClub } from '../../services/clubs.ts';

export default function ClubMembers() {
  const { club, privUser, superUser, allowUser } = useOutletContext<ClubContext>();

  const [members, setMembers] = useState<{ id: string; display_name: string; role: 'member' | 'moderator' | 'president' }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
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

  // Track loading state per specific action and member (e.g., 'promote-abc123')
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMembers() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchClubMembers(club.club_id);
        if (cancelled) return;
        setMembers(data);
      } catch (err: any) {
        if (!cancelled) setError(errorMessages[err.code] ?? errorMessages['generic']);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMembers();
    return () => { cancelled = true; };
  }, [club.club_id]);

  useEffect(() => {
    if (!allowUser) {
      navigate(`/clubs/${club.club_id}`, { replace: true });
    }
  }, [allowUser, club.club_id, navigate]);

  if (!allowUser) {
    return null;
  }

  const president = members.find((member) => member.role === 'president');
  const moderators = members.filter((member) => member.role === 'moderator');
  const regularMembers = members.filter((member) => member.role === 'member');

  moderators.sort((a, b) => a.display_name.localeCompare(b.display_name));
  regularMembers.sort((a, b) => a.display_name.localeCompare(b.display_name));

  async function handlePromote(memberId: string, memberName: string) {
    const confirmed = window.confirm(`Are you sure you want to promote ${memberName} to a moderator of this club?`);
    if (!confirmed) return;

    setLoadingKey(`promote-${memberId}`);
    setActionError('');
    try {
      await promoteMemberToModerator(club.club_id, memberId);
      setMembers((current) =>
        current.map((member) =>
          member.id === memberId
            ? { ...member, role: 'moderator' }
            : member
        )
      );
    } catch (err: any) {
      setActionError(errorMessages[err.code] ?? errorMessages['generic']);
    } finally {
      setLoadingKey(null);
    }
  }

  async function handleDemote(memberId: string, memberName: string) {
    const confirmed = window.confirm(`Are you sure you want to demote ${memberName} to a member of this club?`);
    if (!confirmed) return;

    setLoadingKey(`demote-${memberId}`);
    setActionError('');
    try {
      await demoteModeratorToMember(club.club_id, memberId);
      setMembers((current) =>
        current.map((member) =>
          member.id === memberId
            ? { ...member, role: 'member' }
            : member
        )
      );
    } catch (err: any) {
      setActionError(errorMessages[err.code] ?? errorMessages['generic']);
    } finally {
      setLoadingKey(null);
    }
  }

  async function handleRemove(memberId: string, memberName: string) {
    const confirmed = window.confirm(`Are you sure you want to remove ${memberName} from this club?`);
    if (!confirmed) return;

    setLoadingKey(`remove-${memberId}`);
    setActionError('');
    try {
      await removeUserFromClub(club.club_id, memberId);
      setMembers((current) =>
        current.filter((member) => member.id !== memberId)
      );
    } catch (err: any) {
      setActionError(errorMessages[err.code] ?? errorMessages['generic']);
    } finally {
      setLoadingKey(null);
    }
  }

  const renderMemberRow = (member: { id: string; display_name: string; role: 'member' | 'moderator' | 'president' }) => (
    <li
      key={member.id}
      className="flex flex-col items-start justify-between gap-3 py-3 px-1 sm:flex-row sm:items-center"
    >
      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-ink">
        <FontAwesomeIcon icon={faCircleUser} className="shrink-0" />
        <span className="truncate">{member.display_name}</span>
      </span>

      {privUser && member.role !== 'president' && (
        <div className="flex w-full shrink-0 justify-end gap-2 sm:w-auto">
          {member.role === 'member' && (
            <>
              {superUser && (
                <button
                  onClick={() => handlePromote(member.id, member.display_name)}
                  disabled={loadingKey === `promote-${member.id}`}
                  className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-ink shadow-sm transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingKey === `promote-${member.id}` ? 'Promoting...' : 'Promote to Moderator'}
                </button>
              )}
              <button
                onClick={() => handleRemove(member.id, member.display_name)}
                disabled={loadingKey === `remove-${member.id}`}
                className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingKey === `remove-${member.id}` ? 'Removing...' : 'Remove'}
              </button>
            </>
          )}

          {member.role === 'moderator' && superUser && (
            <>
              <button
                onClick={() => handleDemote(member.id, member.display_name)}
                disabled={loadingKey === `demote-${member.id}`}
                className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-ink shadow-sm transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingKey === `demote-${member.id}` ? 'Demoting...' : 'Demote to Member'}
              </button>
              <button
                onClick={() => handleRemove(member.id, member.display_name)}
                disabled={loadingKey === `remove-${member.id}`}
                className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingKey === `remove-${member.id}` ? 'Removing...' : 'Remove'}
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );

  return (
    <div className="space-y-6">
      {actionError && (
        <p className="text-sm text-red-600 text-center">{actionError}</p>
      )}

      {loading && (
        <ul className="divide-y divide-primary-soft lg:max-w-3xl lg:mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div className="h-4 w-40 animate-pulse rounded bg-primary-soft" />
              {privUser && (
                <div className="flex gap-2">
                  <div className="h-7 w-20 animate-pulse rounded bg-primary-soft" />
                  {superUser && <div className="h-7 w-16 animate-pulse rounded bg-primary-soft" />}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && error && (
        <p className="text-sm text-red-600">Failed to load members: {error}</p>
      )}

      {!loading && !error && members.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary-soft py-16 text-center">
          <FontAwesomeIcon icon={faUsers} className="text-3xl text-primary-soft" />
          <p className="text-sm font-semibold text-muted">No Members Yet</p>
        </div>
      )}

      {!loading && !error && members.length > 0 && (
        <div className="space-y-6 lg:mx-auto lg:max-w-3xl">
          {/* President Section */}
          {president && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 px-1">Club President</h3>
              <ul className="divide-y divide-primary/20 border-y border-primary/20">
                {renderMemberRow(president)}
              </ul>
            </div>
          )}

          {/* Moderators Section */}
          {moderators.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 px-1">Club Moderators</h3>
              <ul className="divide-y divide-primary/20 border-y border-primary/20">
                {moderators.map(renderMemberRow)}
              </ul>
            </div>
          )}

          {/* Members Section */}
          {regularMembers.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 px-1">Members</h3>
              <ul className="divide-y divide-primary/20 border-y border-primary/20">
                {regularMembers.map(renderMemberRow)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}