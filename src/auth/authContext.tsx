import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

interface Profile {
  id: string
  email: string
  first_name: string
  middle_name?: string
  last_name: string
  role: 'user' | 'admin'
  phone_number?: string
  major?: string
}

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    fields: {
      firstName: string
      middleName?: string
      lastName: string
      phoneNumber?: string
      major?: string
    }
  ) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, middle_name, last_name, role, phone_number, major')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error.message)
      setProfile(null)
    } else {
      setProfile(data)
    }
    setLoading(false)
  }

  async function refreshProfile() {
    if (!user) return;
    await fetchProfile(user.id);
  }

  async function signUp(
    email: string,
    password: string,
    fields: {
      firstName: string
      middleName?: string
      lastName: string
      phoneNumber?: string
      major?: string
    }
  ) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: fields.firstName,
          middle_name: fields.middleName,
          last_name: fields.lastName,
          phone_number: fields.phoneNumber,
          major: fields.major
        },
      },
    })

    return { error }
  }


  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}