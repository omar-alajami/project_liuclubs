import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

type EditableFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onSave: (newValue: string) => Promise<void>;
};

function EditableField({ label, value, placeholder, onSave }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setDraft(value);
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraft(value);
    setError(null);
    setIsEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      await onSave(draft.trim());
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-ink">{label}</label>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            autoFocus
            disabled={saving}
            className="w-full rounded-md border border-accent bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:ring-2 focus:ring-accent disabled:opacity-60"
          />
        ) : (
          <div className="w-full truncate rounded-md border border-primary-soft bg-primary-soft/30 px-3 py-2 text-sm text-ink">
            {value || <span className="text-muted">{placeholder ?? 'Not set'}</span>}
          </div>
        )}

        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              aria-label={`Save ${label}`}
              className="flex-shrink-0 rounded-md bg-gradient-to-br from-accent to-accent-light px-3 py-2 text-sm font-bold text-ink shadow-md shadow-accent/20 transition-colors hover:from-accent-dark hover:to-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
              aria-label={`Cancel editing ${label}`}
              className="flex-shrink-0 rounded-md border border-primary-soft px-3 py-2 text-sm text-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            aria-label={`Edit ${label}`}
            className="flex-shrink-0 rounded-md border border-primary-soft px-3 py-2 text-sm text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default EditableField;