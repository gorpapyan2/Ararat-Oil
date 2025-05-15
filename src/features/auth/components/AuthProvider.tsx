import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AuthState, PasswordResetRequest, LoginCredentials, RegisterCredentials } from '../types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;  
  logout: () => Promise<void>;
  resetPassword: (request: PasswordResetRequest) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={{
      ...auth,
      resetPassword: async (request: PasswordResetRequest) => {
        // Implement resetPassword functionality
        console.warn('resetPassword not implemented');
      },
      checkAuth: async () => {
        // Implement checkAuth functionality
        console.warn('checkAuth not implemented');
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 