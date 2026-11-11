type SpinnerProps = {
  className?: string
}

export default function Spinner({ className = '' }: SpinnerProps) {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-soft border-t-primary" />
    </div>
  )
}