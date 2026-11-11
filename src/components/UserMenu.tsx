import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

type UserMenuProps = {
  firstName: string
  lastName: string
  middleName: string
  onSignOut: () => void
}

function UserMenu({ firstName, middleName, lastName, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        aria-expanded={open}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          open
            ? 'bg-primary text-white'
            : 'bg-primary-soft text-primary hover:bg-primary hover:text-white'
        }`}
      >
        <FontAwesomeIcon icon={faCircleUser} className="text-2xl" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-56 rounded-lg border border-primary-soft bg-white py-2 shadow-lg">
          <div className="border-b border-primary-soft px-4 py-2">
            <p className="text-sm font-semibold text-ink">
              {firstName} {middleName} {lastName}
            </p>
          </div>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-ink hover:bg-primary-soft"
          >
            Profile
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-ink hover:bg-primary-soft"
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              setOpen(false)
              onSignOut()
            }}
            className="block w-full px-4 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu;