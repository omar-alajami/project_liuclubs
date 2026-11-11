import { useEffect, useMemo, useState } from 'react';
import { fetchClubs } from '../services/clubs.ts';
import type { Club } from '../assets/types';
import ClubCard from '../components/ClubCard';
import ClubCardSkeleton from '../components/ClubCardSkeleton';
import { useSearchParams } from 'react-router-dom';

function Clubs() {
  
  const [params] = useSearchParams();

  const SCHOOLS = ['SoPH', 'SoBU', 'SoED', 'SoEN', 'SoAS']

  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(params.get('school') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(params.get('category') ?? '');

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

  useEffect(() => {
    const loadClubs = async () => {
      setLoading(true);
      setError(null)
      try {
        const allClubs = await fetchClubs();
        setClubs(allClubs);
      } catch (err: any) {
        setError(errorMessages[err.code] ?? errorMessages['generic']);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, []);


  const allCategories = useMemo(() => {
    const set = new Set<string>()
    clubs.forEach((club) => club.categories.forEach((cat) => set.add(cat)))
    return Array.from(set).sort()
  }, [clubs])

  const filteredClubs = useMemo(() => {
    const query = search.trim().toLowerCase()

    return clubs.filter((club) => {
      const matchesSearch =
        !query ||
        club.name.toLowerCase().includes(query) ||
        club.short_description.toLowerCase().includes(query) ||
        club.club_id.toLowerCase().includes(query)

      const matchesSchool = !selectedSchool || club.school.toLowerCase() === selectedSchool.toLowerCase()
      const matchesCategory = !selectedCategory || club.categories.includes(selectedCategory)

      return matchesSearch && matchesSchool && matchesCategory
    })
  }, [clubs, search, selectedSchool, selectedCategory])

  return (
    <div>
      <div className="bg-primary px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-white">Browse Clubs</h1>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 rounded-md border-0 bg-white text-sm text-ink placeholder:text-muted focus:ring-2 focus:ring-accent"
            />

            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="rounded-md border-0 bg-white text-sm text-ink focus:ring-2 focus:ring-accent"
            >
              <option value="">All Schools</option>
              {SCHOOLS.map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border-0 bg-white text-sm text-ink focus:ring-2 focus:ring-accent"
            >
              <option value="">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-accent" />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <ClubCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-600">Failed to load clubs: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredClubs.map((club) => (
              <ClubCard key={club.club_id} club={club} />
            ))}
          </div>
        )}

        {!loading && !error && filteredClubs.length === 0 && (
          <p className="text-sm text-muted">No clubs match your search.</p>
        )}
      </div>
    </div>
  )
}

export default Clubs;