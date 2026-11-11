import { useState, useRef, useEffect, type SubmitEvent } from 'react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import wide_logo from '../assets/wide_1.png';
import { supabase } from '../auth/supabaseClient.ts';

type LocationState = {
  email?: string
}

const errorMessages: Record<string, string> = {
  otp_expired: 'This code has expired. Request a new one below.',
  invalid_credentials: 'Incorrect code. Please check and try again.',
  over_request_rate_limit: 'Too many attempts. Please wait a minute and try again.',
  generic: 'Something went wrong. Please try again.',
}
const RESEND_COOLDOWN_SECONDS = 60;

export default function ConfirmEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? {}) as LocationState

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS)

  useEffect(() => {
    if (resendCooldown === 0) return
    const id = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [resendCooldown])

  if (!state.email) {
    return <Navigate to="/signup" replace />
  }
  const email = state.email;

  function showError(message: string) {
    setInfo(null)
    setError(message)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function showInfo(message: string) {
    setError(null)
    setInfo(message)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleVerify(e: SubmitEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!/^\d{6}$/.test(code)) {
      showError('Enter the 6-digit code sent to your email.')
      return
    }

    setVerifying(true)
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: 'signup',
    })
    setVerifying(false)

    if (error) {
      showError(errorMessages[error.code ?? 'generic'] ?? errorMessages.generic)
      return
    }

    navigate('/', { replace: true })
  }

  async function handleResend() {
    setError(null)
    setInfo(null)
    setResending(true)
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    setResending(false)

    if (error) {
      showError(errorMessages[error.code ?? 'generic'] ?? errorMessages.generic)
      return
    }
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    showInfo(`A new code has been sent to your email. Please don't abuse the "resend" feature, thank you!`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 py-10">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <Link to="/home" className="flex flex-shrink-0 items-center justify-center">
            <img src={wide_logo} alt="LIU CLUBS" className="h-auto w-[60%] py-3" />
          </Link>
          <br />
          <h1 className="text-3xl font-bold text-ink">Confirm your email</h1>
          <p className="text-sm text-muted">
            Enter the 6-digit code we sent to <span className="font-semibold text-ink">{email}</span>.
            If you don't see the email in your inbox then check the spam folder.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-4 rounded-md border-l-4 border-green-500 bg-green-50 px-4 py-3 text-sm text-green-700">
            {info}
          </div>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-semibold text-ink">
              Confirmation code
            </label>
            <OtpInput value={code} onChange={setCode} />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="mt-2 rounded-md bg-gradient-to-br from-accent to-accent-light px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:from-accent-dark hover:to-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifying ? 'Confirming...' : 'Confirm'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Didn't get a code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resendCooldown > 0}
            className="font-semibold text-primary hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resending
              ? 'Sending...'
              : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend code'}
          </button>
        </p>
      </div>
    </div>
  )
}

function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string
  onChange: (value: string) => void
  length?: number
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, raw: string) {
    // Typing only. Deletion is handled in handleKeyDown.
    // Only the last typed character matters, which covers both a fresh
    // keystroke and an autofill dropping several characters into one box.
    const digit = raw.replace(/\D/g, '').slice(-1)
    if (!digit) return

    // Never write past the end of the current code, so there are no gaps.
    const pos = Math.min(index, value.length)
    onChange(value.slice(0, pos) + digit + value.slice(pos + 1))
    if (pos < length - 1) inputRefs.current[pos + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[index]) {
        // Box has a digit: delete it and stay on this box.
        onChange(value.slice(0, index) + value.slice(index + 1))
      } else if (index > 0) {
        // Box is empty: delete the previous digit and move back.
        onChange(value.slice(0, index - 1) + value.slice(index))
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    onChange(pasted)
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="h-14 w-12 rounded-md border border-primary-soft text-center text-2xl font-semibold outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
        />
      ))}
    </div>
  )
}