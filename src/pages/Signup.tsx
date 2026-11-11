// src/pages/Signup.tsx
import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext'
import wide_logo from '../assets/wide_1.png'
import { checkPassword, checkName, checkMidName, checkPhone, checkMajor, checkEmail } from '../assets/utils.ts';

export default function Signup() {
  const { signUp } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [major, setMajor] = useState('')
  const navigate = useNavigate();

  const errorMessages: Record<string, string> = {
    user_already_exists: 'An account with this email already exists.',
    weak_password: 'You should not see this, if you do, send us an email and we will get back to you.',
    email_address_invalid: 'Invalid email address.',
    over_email_send_rate_limit: 'Too many attempts. Please wait a minute and try again.',
    generic: 'Something went wrong. Please wait a minute and try again.'
  }

  function showError(message: string) {
    setError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    setError(null)

    if (!checkName(firstName)){
      showError('Invalid first name');
      return;
    }
    if (!checkName(lastName)){
      showError('Invalid last name');
      return;
    }
    if (!checkMidName(middleName)){
      showError('Invalid middle name');
      return;
    }

    if (!checkEmail(email)){
      showError('Invalid email, you can only use your LIU email.')
      return;
    }
    
    const passwordError = checkPassword(password);
    if (passwordError) {
      showError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      showError('"Confirm Password" and "Password" are different.');
      return;
    }

    if (!checkPhone(phoneNumber)) {
      showError('Invalid phone number')
      return;
    }

    if (!checkMajor(major)){
      showError('Invalid major');
      return;
    }

    setLoading(true);

    const { error } = await signUp(
      email.trim(),
      password, 
      {
        firstName: firstName.trim().replace(/\s+/g, " "),
        middleName: middleName.trim().replace(/\s+/g, " ") || undefined,
        lastName: lastName.trim().replace(/\s+/g, " "),
        phoneNumber: phoneNumber || undefined,
        major: major.trim().replace(/\s+/g, " ") || undefined
      }
    );

    setLoading(false)

    if (error) {
      const e = 'code' in error ? (error.code ? error.code : 'generic') : 'generic';
      showError(errorMessages[e] ?? errorMessages['generic']);
      return;
    }

    navigate('/signup/verify', {
      replace: true,
      state: { email },
    })
    return;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 py-10">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <Link
            to="/home"
            className="flex flex-shrink-0 items-center justify-center"
            replace
          >
            <img 
              src={wide_logo} alt="LIU CLUBS"
              className="h-auto w-[60%] py-3"
            />
          </Link>
          <br />
          <h1 className="text-3xl font-bold text-ink">Create Account</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-md border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <p className="mb-4 text-xs italic text-muted">* indicates a required field</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-sm font-semibold text-ink">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-sm font-semibold text-ink">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>
          <div>
            <label htmlFor="middleName" className="mb-1.5 block text-sm font-semibold text-ink">
              Middle Name
            </label>
            <input
              id="middleName"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
            <div className="mt-2 rounded-md border-l-4 border-muted bg-primary-soft/40 px-3 py-2.5">
              <p className="text-xs font-semibold text-muted">You can only use your LIU email</p>
              <ul className="mt-1 space-y-0.5 text-xs text-muted">
                <li>For students: [id]@students.liu.edu.lb</li>
                <li>For faculty: [name]@liu.edu.lb</li>
              </ul>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
            <div className="mt-2 rounded-md border-l-4 border-muted bg-primary-soft/40 px-3 py-2.5">
              <p className="text-xs font-semibold text-muted">Password requirements:</p>
              <ul className="mt-1 space-y-0.5 text-xs text-muted">
                <li>• Between 8 and 64 characters</li>
                <li>• Must include at least 1 letter, 1 number, and 1 special character</li>
                <li>• No leading/trailing spaces (you can use spaces in the middle)</li>
              </ul>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-ink">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="mb-1.5 block text-sm font-semibold text-ink">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>
          <div>
            <label htmlFor="major" className="mb-1.5 block text-sm font-semibold text-ink">
              Major
            </label>
            <input
              id="major"
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-gradient-to-br from-accent to-accent-light px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:from-accent-dark hover:to-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark" replace>
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}