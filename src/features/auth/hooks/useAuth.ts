import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { authService } from '../services/authService'
import type { AuthState, LoginCredentials, RegisterCredentials, PasswordResetRequest } from '../types/auth.types'

export function useAuth() {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session: session,
          isLoading: false,
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }))
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session: session,
      }))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { user, session, error } = await authService.login(credentials)
      if (error) throw error

      setState(prev => ({
        ...prev,
        user,
        session,
        isLoading: false,
      }))

      navigate('/')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }))
    }
  }, [navigate])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { user, session, error } = await authService.register(credentials)
      if (error) throw error

      setState(prev => ({
        ...prev,
        user,
        session,
        isLoading: false,
      }))

      navigate('/')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }))
    }
  }, [navigate])

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { error } = await authService.logout()
      if (error) throw error

      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        isLoading: false,
      }))

      navigate('/login')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }))
    }
  }, [navigate])

  const requestPasswordReset = useCallback(async (request: PasswordResetRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { error } = await authService.requestPasswordReset(request)
      if (error) throw error

      setState(prev => ({
        ...prev,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }))
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { error } = await authService.updatePassword(password)
      if (error) throw error

      setState(prev => ({
        ...prev,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }))
    }
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    requestPasswordReset,
    updatePassword,
  }
} 