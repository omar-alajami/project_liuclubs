// components/AnnouncementCardSkeleton.tsx
function AnnouncementCardSkeleton() {
  return (
    <div className="rounded-lg border border-primary-soft bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-primary-soft" />
        <div className="h-3 w-24 flex-shrink-0 animate-pulse rounded bg-primary-soft" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-primary-soft" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-primary-soft" />
      </div>
    </div>
  )
}

export default AnnouncementCardSkeleton;