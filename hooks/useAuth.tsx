'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, User } from '@/lib/supabaseClient'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)

    if (session?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUser(userData)
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      await refreshUser()
      setLoading(false)
    }

    initialize()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser(userData)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    refreshUser,
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