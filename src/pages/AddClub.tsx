import { useState, type SubmitEvent } from 'react';
import { useAuth } from '../auth/authContext.tsx';
import { createClubWithPresident } from '../services/clubs.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import categoriesList from '../assets/categories.json';

const SCHOOLS = ['SoPH', 'SoBU', 'SoED', 'SoEN', 'SoAS'];
const CLUB_ID_PATTERN = /^[a-z0-9-]+$/;

function AddClub() {
  const { profile } = useAuth();

  const [clubId, setClubId] = useState('');
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [school, setSchool] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [presidentEmail, setPresidentEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-sm text-muted">Not that easy haha. Anyway the clubs table is protected at the database level through rls - there's only 1 insert policy which allows insert ONLY if user is authenticated AND is admin, but nice try.</p>
      </div>
    )
  }

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  function resetForm() {
    setClubId('');
    setName('');
    setShortDescription('');
    setDescription('');
    setSchool('');
    setSelectedCategories([]);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmedId = clubId.trim();

    if (!CLUB_ID_PATTERN.test(trimmedId)) {
      setError('Club ID must be lowercase letters, numbers, and hyphens only.');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Select at least one category.');
      return;
    }

    if (!school) {
      setError('Select a school.');
      return;
    }

    setSubmitting(true);

    try {
      await createClubWithPresident({
        clubId: trimmedId,
        name: name.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        school,
        categories: selectedCategories,
        presidentEmail: presidentEmail.trim(),
      })

      setSuccess(true);
      resetForm();
    } catch (err: any) {
      setError(err.message ?? 'no error message?????');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Add Club</h1>

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center justify-between rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          <span>Club added successfully.</span>
          <button onClick={() => setSuccess(false)} aria-label="Dismiss">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor="club_id" className="block text-sm font-semibold text-ink">Club ID</label>
          <input
            id="club_id"
            type="text"
            value={clubId}
            onChange={(e) => setClubId(e.target.value)}
            className="mt-1 w-full rounded-md border border-primary-soft px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
            placeholder="Enter club id..."
            required
          />
          <p className="mt-1 text-xs text-muted">Lowercase letters, numbers, and hyphens only.</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-ink">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-primary-soft px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
            placeholder="Enter club name..."
            required
          />
          <p className="mt-1 text-xs text-muted">Try not to add "Club" at the end of the name - make sure capitalization is what you want.</p>
        </div>

        <div>
          <label htmlFor="short_description" className="block text-sm font-semibold text-ink">Short Description</label>
          <input
            id="short_description"
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-primary-soft px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
            placeholder="Short description on card and at hero section..."
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-ink">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1 w-full rounded-md border border-primary-soft px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        <div>
          <label htmlFor="school" className="block text-sm font-semibold text-ink">School</label>
          <select
            id="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="mt-1 w-full rounded-md border border-primary-soft px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
            required
          >
            <option value="">Select a school</option>
            {SCHOOLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pres_email" className="block text-sm font-semibold text-ink">President's Email</label>
          <input
            id="pres_email"
            type="email"
            value={presidentEmail}
            onChange={(e) => setPresidentEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-primary-soft px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
            placeholder="Enter president's email..."
            required
          />
        </div>

        <div>
          <span className="block text-sm font-semibold text-ink">Categories</span>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(categoriesList as string[]).map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded border-primary-soft text-accent focus:ring-accent"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-gradient-to-br from-accent to-accent-light px-4 py-2 text-sm font-bold text-ink shadow-md shadow-accent/20 transition-colors hover:from-accent-dark hover:to-accent disabled:opacity-50"
        >
          {submitting ? 'Adding...' : 'Add Club'}
        </button>
      </form>
    </div>
  )
}

export default AddClub;