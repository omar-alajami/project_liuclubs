import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask, faBriefcase, faGraduationCap, faGears, faCapsules, faCalendar, faUserPlus, faMagnifyingGlass, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { fetchClubCount, fetchFeaturedClubs } from '../services/clubs';
import ClubCard from '../components/ClubCard';
import ClubCardSkeleton from '../components/ClubCardSkeleton';
import type { Club } from '../assets/types';

function Home() {

  const schoolCardStyles: Record<string, any> = {
    soph: { iconBg: 'bg-soph-soft', iconText: 'text-soph-dark', border: 'hover:border-soph/30', bg: 'hover:bg-soph-soft', iconHover: 'group-hover:bg-soph' }, 
    sobu: { iconBg: 'bg-sobu-soft', iconText: 'text-sobu-dark', border: 'hover:border-sobu/30', bg: 'hover:bg-sobu-soft', iconHover: 'group-hover:bg-sobu' }, 
    soed: { iconBg: 'bg-soed-soft', iconText: 'text-soed-dark', border: 'hover:border-soed/30', bg: 'hover:bg-soed-soft', iconHover: 'group-hover:bg-soed' }, 
    soen: { iconBg: 'bg-soen-soft', iconText: 'text-soen-dark', border: 'hover:border-soen/30', bg: 'hover:bg-soen-soft', iconHover: 'group-hover:bg-soen' }, 
    soas: { iconBg: 'bg-soas-soft', iconText: 'text-soas-dark', border: 'hover:border-soas/30', bg: 'hover:bg-soas-soft', iconHover: 'group-hover:bg-soas' }, 
  }
  const SCHOOLS = [
    {
      "code": "SoPH",
      "name": "School of Pharmacy",
      "icon": faCapsules
    },
    {
      "code": "SoAS",
      "name": "School of Arts & Sciences",
      "icon": faFlask
    },
    {
      "code": "SoED",
      "name": "School of Education",
      "icon": faGraduationCap
    },
    {
      "code": "SoEN",
      "name": "School of Engineering",
      "icon": faGears
    },
    {
      "code": "SoBU",
      "name": "School of Business",
      "icon": faBriefcase
    }
  ]

  const [clubCount, setClubCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [featuredClubs, setFeaturedClubs] = useState<Club[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);
  const featuredClubIds = ['writing', 'engineeringclub'];

  //fetch clubcount
  useEffect(() => {
    const loadCount = async () => {
      setLoading(true)
      setError(false)

      try {
        const count = await fetchClubCount()
        setClubCount(count)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadCount()
  }, [])

  //fetch featuredclubs
  useEffect(() => {
    const loadFeatured = async () => {
      setFeaturedLoading(true)
      setFeaturedError(false)

      try {
        const clubs = await fetchFeaturedClubs(featuredClubIds)
        setFeaturedClubs(clubs)
      } catch (err) {
        setFeaturedError(true)
      } finally {
        setFeaturedLoading(false)
      }
    }

    loadFeatured()
  }, [])

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-primary">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 pb-16 pt-14 md:flex-row md:items-center md:justify-between md:gap-8 md:pb-20 md:pt-20">
          <div className="max-w-2xl">
            <h1 className="mt-3 font-display text-5xl leading-[1.05] tracking-tight text-white md:text-6xl">
              Be part of the community
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
              Browse every club at LIU Bekaa, find the one that fits you, join with a click
              to stay in the loop, and participate in the events they run. Together, towards a better future.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/clubs"
                className="rounded-md bg-gradient-to-br from-accent to-accent-light px-5 py-2.5 text-sm font-bold text-ink shadow-md shadow-accent/20 transition-colors hover:from-accent-dark hover:to-accent"
              >
                Browse Clubs
              </Link>
              <Link
                to="/request-club"
                className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Request to Create Club
              </Link>
            </div>
          </div>

          <div className="flex flex-shrink-0 flex-col items-center justify-center text-center">
            <span className="font-display text-7xl font-semibold leading-none text-accent md:text-8xl">
              {loading || error || clubCount === null ? '--' : clubCount}
            </span>
            <span className="my-2 h-px w-32 bg-accent/40" />
            <span className="mt-2 block text-center text-lg font-semibold leading-snug text-accent md:text-xl">
              Clubs &<br />Counting
            </span>
          </div>
        </div>
        <div className="h-1 w-full bg-accent" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl text-ink md:text-3xl">Browse by School</h2>
          <Link to="/clubs" className="text-sm font-semibold text-primary hover:text-primary-dark">
            View All Clubs<FontAwesomeIcon icon={faAngleRight} />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4">
          {SCHOOLS.map((school, i) => {
            const style = schoolCardStyles[school.code.toLowerCase()];
            const centerClass = i === 3 ? 'md:col-start-2' : i === 4 ? 'md:col-start-4' : ''

            return (
              <Link
                key={school.code}
                to={`/clubs?school=${encodeURIComponent(school.code)}`}
                className={`group flex items-center gap-3 rounded-md border border-primary/10 px-4 py-4 transition-colors md:col-span-2 ${centerClass} ${style.border} ${style.bg}`}
              >
                <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md ${style.iconBg} ${style.iconText} transition-colors ${style.iconHover} group-hover:text-white`}>
                  <FontAwesomeIcon icon={school.icon} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{school.name}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured clubs */}
      <section className="border-t border-primary-soft bg-primary-soft/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-2xl text-ink md:text-3xl">Featured Clubs</h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            A handful of clubs that are especially active right now:
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {featuredLoading &&
              Array.from({ length: 4 }).map((_, i) => <ClubCardSkeleton key={i} />)}

            {!featuredLoading && featuredError && (
              <p className="col-span-full text-sm text-red-600">
                Failed to load featured clubs.
              </p>
            )}

            {!featuredLoading && !featuredError && featuredClubs.length === 0 && (
              <p className="col-span-full text-sm text-muted">
                No Featured Clubs.
              </p>
            )}

            {!featuredLoading && !featuredError && featuredClubs.map((club) => <ClubCard key={club.club_id} club={club} />)}
          </div>
        </div>
      </section>

      {/* create club banner */}
      <section className="bg-primary">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl text-white md:text-3xl">
              Don't see your thing? Start it.
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/70">
              Any student can propose a new club. Fill out a short form and we will follow up within a week.
            </p>
          </div>
          <Link
            to="/request-club"
            className="flex-shrink-0 rounded-md bg-gradient-to-br from-accent to-accent-light px-6 py-3 text-sm font-bold text-ink shadow-md shadow-accent/20 transition-colors hover:from-accent-dark hover:to-accent"
          >
            Start a Club
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-display text-2xl text-ink md:text-3xl">How It Works</h2>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ink">Browse</h3>
              <p className="mt-2 max-w-xs text-sm text-muted">
                Explore clubs and find what fits you.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ink">Join</h3>
              <p className="mt-2 max-w-xs text-sm text-muted">
                Join with one click and become a member.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                <FontAwesomeIcon icon={faCalendar} className="text-lg" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ink">Participate</h3>
              <p className="mt-2 max-w-xs text-sm text-muted">
                Show up to events and stay in the loop on what's next.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;
