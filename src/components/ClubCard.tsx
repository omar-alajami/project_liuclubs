import type { Club } from "../assets/types";
import { useState } from "react";
import { Link } from "react-router-dom";

function ClubCard({ club }: { club: Club }) {

  const schoolStyles: Record<string, string> = {
    SoPH: 'bg-soph-soft text-soph-dark',
    SoBU: 'bg-sobu-soft text-sobu-dark',
    SoED: 'bg-soed-soft text-soed-dark',
    SoEN: 'bg-soen-soft text-soen-dark',
    SoAS: 'bg-soas-soft text-soas-dark',
  }
  const [logoSrc, setLogoSrc] = useState(`/clubs/${club.club_id}/logo.png`);

  return (
    <Link to={`/clubs/${club.club_id}`} state={{club}} className="flex items-center gap-4 rounded-md border border-primary/30 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">      
      <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden">
        <img src={logoSrc} alt={club.club_id} className="h-full w-full object-contain" onError={() => setLogoSrc('/clubs/default_logo.png')}/>
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-lg font-semibold text-ink">{club.name}</h3>
          <span
            className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              schoolStyles[club.school] ?? 'bg-white text-muted'
            }`}
          >
            {club.school}
          </span>
        </div>
        <p className="mt-1 min-h-[3.75rem] text-sm leading-5 text-muted line-clamp-3">
          {club.short_description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {club.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary"
              >
                {cat}
              </span>
            ))}
          </div>

          <span className="flex-shrink-0 text-xs font-medium text-primary">
            {club.member_count} Member{club.member_count === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ClubCard;