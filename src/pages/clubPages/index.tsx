import { useOutletContext } from 'react-router-dom'
import type { ClubContext } from '../ClubLayout.tsx'

export default function ClubOverview() {
  const { club } = useOutletContext<ClubContext>()
  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Description</h2>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/80">
        {club.description}
      </p>
    </div>
  )
}