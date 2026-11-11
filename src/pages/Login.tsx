import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext'
import wide_logo from '../assets/wide_1.png'

export default function Login() {

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const errorMessages: Record<string, string> = {
    invalid_credentials: 'Wrong email or password, please try again',
    email_not_confirmed: 'Your email is not confirmed! Please confirm your email before attempting to log in',
    over_request_rate_limit: 'Too many requests! Please wait a minute then try again.',
    generic: 'Something went wrong. Please wait a minute and try again.'
  }
  function showError(message: string) {
    setError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email.trim(), password)

    if (error?.code === 'email_not_confirmed'){
      navigate('/signup/verify', {
        replace: true,
        state: { email },
      })
      return;
    }

    if (error) {
      showError(errorMessages[error.code ?? ''] ?? errorMessages['generic']);
      setLoading(false)
      return;
    }

    navigate('/', {replace: true});
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {/* Header */}
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
          <h1 className="text-3xl font-bold text-ink">Log In</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-md border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className="w-full rounded-md border border-primary-soft px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-gradient-to-br from-accent to-accent-light px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:from-accent-dark hover:to-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark" replace>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}