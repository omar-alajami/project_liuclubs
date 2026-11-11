import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../auth/authContext.tsx';
import Spinner from '../assets/Spinner.tsx';
import EditableField from '../components/EditableField.tsx';
import { updateProfile } from '../services/clubs.ts';
import { checkName, checkMidName, checkMajor, checkPhone } from '../assets/utils.ts';

function Profile() {
  const { profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile) {
      navigate('/login');
    }
  }, [loading, profile, navigate]);

  async function handleChangeFirstName(first_name: string) {
    if (!checkName(first_name)) throw new Error('Invalid first name');
    
    await updateProfile(profile?.id ?? '', { first_name });
    await refreshProfile();
  }

  async function handleChangeMiddleName(middle_name: string) {
    if (!checkMidName(middle_name)) {
      throw new Error('Invalid middle name');
    }
    await updateProfile(profile?.id ?? '', { middle_name });
    await refreshProfile();
  }

  async function handleChangeLastName(last_name: string) {
    if (!checkName(last_name)) {
      throw new Error('Invalid last name');
    }
    await updateProfile(profile?.id ?? '', { last_name });
    await refreshProfile();
  }

  async function handleChangePhoneNumber(phone_number: string) {
    if (!checkPhone(phone_number)) {
      throw new Error('Invalid phone number');
    }
    await updateProfile(profile?.id ?? '', { phone_number });
    await refreshProfile();
  }

  async function handleChangeMajor(major: string) {
    if (!checkMajor(major)) {
      throw new Error('Invalid major');
    }
    await updateProfile(profile?.id ?? '', { major });
    await refreshProfile();
  }

  if (loading) return <Spinner />;
  if (!profile) return null;

  const fullName = [profile.first_name, profile.middle_name, profile.last_name]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      <div className="px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <FontAwesomeIcon icon={faCircleUser} className="text-6xl text-ink" />
          <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{fullName}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex flex-col gap-5">
          <EditableField
            label="First Name"
            value={profile.first_name}
            onSave={handleChangeFirstName}
          />
          <EditableField
            label="Middle Name"
            value={profile.middle_name ?? ''}
            placeholder="Not set"
            onSave={handleChangeMiddleName}
          />
          <EditableField
            label="Last Name"
            value={profile.last_name}
            onSave={handleChangeLastName}
          />
          <EditableField
            label="Phone Number"
            value={profile.phone_number ?? ''}
            placeholder="Not set"
            onSave={handleChangePhoneNumber}
          />
          <EditableField
            label="Major"
            value={profile.major ?? ''}
            placeholder="Not set"
            onSave={handleChangeMajor}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;