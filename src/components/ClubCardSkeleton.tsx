// ClubCardSkeleton.tsx
function ClubCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-md border border-primary/30 bg-white p-4 shadow-sm">
      <div className="h-28 w-28 flex-shrink-0 animate-pulse rounded-md bg-primary-soft" />

      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 w-2/3 animate-pulse rounded bg-primary-soft" />
          <div className="h-6 w-12 flex-shrink-0 animate-pulse rounded-full bg-primary-soft" />
        </div>

        <div className="mt-1 min-h-[3.75rem]">
          <div className="h-4 w-full animate-pulse rounded bg-primary-soft" />
          <div className="mt-1 h-4 w-4/5 animate-pulse rounded bg-primary-soft" />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <div className="h-5 w-14 animate-pulse rounded-full bg-primary-soft" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-primary-soft" />
          </div>
          <div className="h-4 w-16 flex-shrink-0 animate-pulse rounded bg-primary-soft" />
        </div>
      </div>
    </div>
  )
}

export default ClubCardSkeleton;