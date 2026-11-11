import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from './authContext.tsx'
import { supabase } from './supabaseClient'

type MembershipContextType = {
  memberships: Map<string, string> // club_id -> role
  loading: boolean
  isMember: (clubId: string) => boolean
  refetchMemberships: () => Promise<void>
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined)

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { profile, loading:authLoading } = useAuth()
  const [memberships, setMemberships] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)

  async function fetchMemberships() {
    if (!profile) {
      setMemberships(new Map())
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('club_members')
      .select('club_id, role')
      .eq('user_id', profile.id)

    if (!error && data) {
      setMemberships(new Map(data.map((row) => [row.club_id, row.role])))
    }
    setLoading(false)
  }

  useEffect(() => {
    if (authLoading) return;
    fetchMemberships();
  }, [authLoading, profile?.id]);

  const isMember = (clubId: string) => memberships.has(clubId)

  return (
    <MembershipContext.Provider
      value={{ memberships, loading, isMember, refetchMemberships: fetchMemberships }}
    >
      {children}
    </MembershipContext.Provider>
  )
}

export function useMembership() {
  const context = useContext(MembershipContext)
  if (context === undefined) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
}