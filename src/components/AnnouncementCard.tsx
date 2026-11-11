import type { Announcement } from '../assets/types.tsx'
import { formatAnnouncementDate } from '../assets/utils.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../auth/authContext.tsx';
import { useState } from 'react';
import { deleteAnnouncement } from '../services/clubs.ts';
import { Link, useOutletContext } from 'react-router-dom';
import type { ClubContext } from '../pages/ClubLayout.tsx';

type AnnouncementCardProps = {
  announcement: Announcement
  onDelete: (id:string) => void
}

function AnnouncementCard({ announcement, onDelete }: AnnouncementCardProps) {
  const { profile } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [delError, setDelError] = useState('');
  const { superUser } = useOutletContext<ClubContext>();
  const isAllowed = superUser || (!!profile && announcement.user?.id === profile.id);

  async function handleDelete(){

    const confirmed = window.confirm('Are you sure you want to delete this announcement?')
    if (!confirmed) return;

    setDeleteLoading(true);
    setDelError('');
    try{
      await deleteAnnouncement(announcement.id);
      onDelete(announcement.id);
    } catch(err:any){
      setDelError(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }


  return (
    <div className="mt-4 rounded-lg border border-primary-soft bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs text-muted mb-2">
        <span> 
          <FontAwesomeIcon icon={faUser} /> 
          { announcement.user 
            ? <> {announcement.user.first_name} {announcement.user.last_name} </>
            : '[DELETED USER]'
          }
        </span>
        <span>{formatAnnouncementDate(announcement.created_at)}</span>
      </div>

      <h3 className="font-bold text-primary">{announcement.title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{announcement.content}</p>

      {isAllowed && (
        <div className="mt-2 flex justify-end gap-3">
          <button
            onClick={() => handleDelete()}
            disabled={deleteLoading}
            className="rounded-md bg-red-600 px-1.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteLoading ? <> <FontAwesomeIcon icon={faTrash} /> Deleting... </> : <> <FontAwesomeIcon icon={faTrash} /> Delete </>}
          </button>
          <Link
            state={{announcement}}
            to='edit'
            className="rounded-md bg-accent px-1.5 py-1.5 text-xs font-bold text-ink shadow-sm transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FontAwesomeIcon icon={faPen} /> Edit
          </Link>
        </div>
      )}

      {delError && <p className="text-sm text-red-600">Error deleting announcement: {delError}</p>}
    </div>
  )
}

export default AnnouncementCard;