# Auth Feature Migration Guide

## Overview
This document outlines the migration of the authentication feature to use Supabase Edge Functions and follow the new feature-based architecture.

## Changes Made

### 1. Edge Function Integration
- Created new edge function at `supabase/functions/auth/index.ts`
- Handles login, logout, session management, and password reset
- Includes logging of auth events
- Implements proper error handling and CORS

### 2. Service Layer Updates
- Updated `authService.ts` to use edge functions
- Added session management methods
- Improved error handling
- Added password reset functionality

### 3. Type System Updates
- Added `SessionDevice` interface for session management
- Updated `AuthResponse` to include session data
- Simplified `AuthError` interface
- Removed deprecated types

### 4. Hook Updates
- Updated `useAuth` hook to handle sessions
- Added password reset functionality
- Improved error handling
- Added session management methods

## How to Use

### Authentication
```typescript
import { useAuth } from '@/features/auth'

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth()

  const handleLogin = async () => {
    await login({
      email: 'user@example.com',
      password: 'password'
    })
  }

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### Session Management
```typescript
import { useAuth } from '@/features/auth'

function SessionManager() {
  const { getSessions, deleteSession } = useAuth()

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId)
  }

  return (
    <div>
      {/* Session management UI */}
    </div>
  )
}
```

### Password Reset
```typescript
import { useAuth } from '@/features/auth'

function PasswordReset() {
  const { requestPasswordReset, updatePassword } = useAuth()

  const handleRequestReset = async () => {
    await requestPasswordReset({
      email: 'user@example.com'
    })
  }

  const handleUpdatePassword = async (newPassword: string) => {
    await updatePassword(newPassword)
  }

  return (
    <div>
      {/* Password reset UI */}
    </div>
  )
}
```

## Migration Steps

1. Update imports to use the new auth feature:
   ```typescript
   // Old
   import { useAuth } from '@/hooks/useAuth'
   
   // New
   import { useAuth } from '@/features/auth'
   ```

2. Update auth state usage:
   ```typescript
   // Old
   const { user, isOffline } = useAuth()
   
   // New
   const { user, session } = useAuth()
   ```

3. Update login/logout calls:
   ```typescript
   // Old
   await login({ email, password })
   await logout()
   
   // New
   await login({ email, password })
   await logout()
   ```

4. Add session management if needed:
   ```typescript
   const { getSessions, deleteSession } = useAuth()
   ```

## Testing

1. Test login flow:
   - Valid credentials
   - Invalid credentials
   - Network errors

2. Test session management:
   - List sessions
   - Delete session
   - Session persistence

3. Test password reset:
   - Request reset
   - Update password
   - Invalid tokens

## Security Considerations

1. All auth operations are now handled through edge functions
2. Session management is more secure with device tracking
3. Password reset flow is more robust
4. Auth events are logged for security monitoring

## Performance Impact

1. Reduced client-side code
2. Better error handling
3. Improved session management
4. More efficient auth state updates

## Rollback Plan

If issues are encountered:

1. Revert to direct Supabase auth:
   ```typescript
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password
   })
   ```

2. Remove edge function calls
3. Restore old auth state management
4. Update types to match old structure

## Next Steps

1. Add two-factor authentication
2. Implement social login
3. Add role-based access control
4. Enhance session management UI 