import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext.tsx';
import UserMenu from './UserMenu.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../assets/Spinner.tsx';

function Navbar() {
  const { profile, signOut, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    setMobileOpen(false)
    navigate('/')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-semibold transition-colors after:absolute after:bottom-0 after:left-1/2 after:right-1/2 after:h-[3px] after:bg-primary after:transition-all ${
      isActive
        ? 'text-accent after:left-3 after:right-3'
        : 'text-ink hover:text-accent after:hover:left-3 after:hover:right-3'
    }`

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-primary-soft bg-white shadow-sm">
      <div className="mx-auto flex h-[64px] max-w-6xl items-center gap-6 px-4">
        {/* Logo / home mark */}
        <Link
          to="/home"
          className="flex h-full flex-shrink-0 flex-col items-center justify-center border-b-[3px] border-accent bg-primary px-4 text-white transition-colors hover:bg-primary-dark "
        >
          <span className="text-sm font-bold leading-tight">LIU Clubs – Bekaa</span>
          <span className="text-xs text-white/70">Find your community</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden flex-1 items-center gap-1 md:flex">
          <NavLink to="/home" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/clubs" className={navLinkClass}>
            Clubs
          </NavLink>
          <NavLink to="/request-club" className={navLinkClass}>
            Create Club
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          {loading ? null : profile ? (<NavLink to="/dashboard" end className={navLinkClass}>
            Dashboard 
          </NavLink>) : null}
        </div>

        {/* Right side: auth actions */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          {loading ? <Spinner /> : profile ? (
            <UserMenu
              firstName={profile.first_name}
              lastName={profile.last_name}
              middleName={profile.middle_name ?? ''}
              onSignOut={handleSignOut}
            />
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-primary-soft px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-gradient-to-br from-accent to-accent-light px-4 py-2 text-sm font-bold text-ink shadow-md shadow-accent/20 transition-colors hover:from-accent-dark hover:to-accent"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="ml-auto flex flex-col gap-[5px] p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span
            className={`block h-[2px] w-6 rounded-full bg-ink transition-transform ${
              mobileOpen ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-[2px] w-6 rounded-full bg-ink transition-opacity ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-[2px] w-6 rounded-full bg-ink transition-transform ${
              mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`absolute left-0 right-0 top-full flex flex-col gap-1 overflow-hidden border-t border-primary-soft bg-white px-4 shadow-md transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'max-h-96 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <NavLink
          to="/home"
          end
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `rounded-md px-3 py-2.5 text-sm font-semibold ${
              isActive ? 'bg-primary text-white' : 'text-ink hover:bg-primary-soft'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/clubs"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `rounded-md px-3 py-2.5 text-sm font-semibold ${
              isActive ? 'bg-primary text-white' : 'text-ink hover:bg-primary-soft'
            }`
          }
        >
          Clubs
        </NavLink>
        <NavLink
          to="/request-club"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `rounded-md px-3 py-2.5 text-sm font-semibold ${
              isActive ? 'bg-primary text-white' : 'text-ink hover:bg-primary-soft'
            }`
          }
        >
          Create Club
        </NavLink>
        <NavLink
          to="/about"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `rounded-md px-3 py-2.5 text-sm font-semibold ${
              isActive ? 'bg-primary text-white' : 'text-ink hover:bg-primary-soft'
            }`
          }
        >
          About
        </NavLink>
        {!loading && profile && (
          <NavLink
            to="/dashboard"
            end
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `rounded-md px-3 py-2.5 text-sm font-semibold ${
                isActive ? 'bg-primary text-white' : 'text-ink hover:bg-primary-soft'
              }`
            }
          >
            Dashboard
          </NavLink>
        )}

        <div className="mt-2 flex flex-col gap-2 border-t border-primary-soft pt-3">
          {loading ? null : profile ? (
            <div className="flex items-center justify-between px-3 py-1">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md py-1.5 text-sm font-semibold text-ink"
              >
                <FontAwesomeIcon icon={faCircleUser} className="text-2xl text-primary" />
                <span>{profile.first_name} {profile.last_name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-md px-3 py-1.5 text-sm font-semibold text-red-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-md border border-primary-soft px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="rounded-md bg-gradient-to-br from-accent to-accent-light px-3 py-2.5 text-sm font-bold text-ink transition-colors hover:from-accent-dark hover:to-accent"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;