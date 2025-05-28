# Authentication Feature

## Overview
The Authentication feature provides a complete solution for user authentication and authorization in the application. It includes components for login, registration, password reset, and route protection, along with hooks and utilities for managing authentication state and user roles.

## Directory Structure
```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── PasswordReset.tsx
│   └── AuthGuard.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useAuthGuard.ts
├── services/
│   └── authService.ts
├── types/
│   └── auth.types.ts
├── utils/
│   └── auth.utils.ts
└── index.ts
```

## Components

### LoginForm
A form component for user login that handles email and password authentication.

```tsx
import { LoginForm } from '@/features/auth';

function LoginPage() {
  return <LoginForm />;
}
```

### RegisterForm
A form component for user registration that collects user information and creates a new account.

```tsx
import { RegisterForm } from '@/features/auth';

function RegisterPage() {
  return <RegisterForm />;
}
```

### PasswordReset
A form component for requesting password reset emails.

```tsx
import { PasswordReset } from '@/features/auth';

function PasswordResetPage() {
  return <PasswordReset />;
}
```

### AuthGuard
A component that protects routes by checking authentication status and user roles.

```tsx
import { AuthGuard } from '@/features/auth';

function ProtectedPage() {
  return (
    <AuthGuard config={{ requiredRole: 'admin' }}>
      <AdminContent />
    </AuthGuard>
  );
}
```

## Hooks

### useAuth
A hook that provides authentication state and actions.

```tsx
import { useAuth } from '@/features/auth';

function ProfilePage() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### useAuthGuard
A hook for protecting routes and checking user roles.

```tsx
import { useAuthGuard } from '@/features/auth';

function AdminPage() {
  const { isAuthenticated, user } = useAuthGuard({ requiredRole: 'admin' });

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <AdminContent />;
}
```

## Services

### authService
A service that handles all authentication-related API calls.

```tsx
import { authService } from '@/features/auth';

// Login
const { user, error } = await authService.login({ email, password });

// Register
const { user, error } = await authService.register({ email, password, firstName, lastName });

// Reset Password
const { error } = await authService.resetPassword({ email });

// Logout
const { error } = await authService.logout();
```

## Types

The feature exports several TypeScript types for authentication:

```tsx
import type {
  AuthUser,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  AuthRole,
  AuthConfig,
} from '@/features/auth';
```

## Utilities

The feature provides utility functions for authentication checks:

```tsx
import { isAuthenticated, hasRequiredRole, hasPermission, formatAuthError } from '@/features/auth';

// Check if user is authenticated
const isLoggedIn = isAuthenticated(user);

// Check if user has required role
const isAdmin = hasRequiredRole(user, 'admin');

// Check if user has specific permission
const canEditUsers = hasPermission(user, 'users.edit');

// Format authentication error messages
const errorMessage = formatAuthError(error);
```

## Migration Guide

### Updating Imports
Replace old imports with new feature-based imports:

```tsx
// Old
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';

// New
import { useAuth, LoginForm } from '@/features/auth';
```

### Removing Old Files
The following files can be safely removed after migration:
- `src/components/auth/*`
- `src/hooks/useAuth.ts`
- `src/services/supabase.ts` (after moving non-auth related functionality)

## Best Practices

1. Always use the `AuthGuard` component for protected routes
2. Use the `useAuth` hook for authentication state and actions
3. Implement role-based access control using `useAuthGuard`
4. Handle authentication errors using `formatAuthError`
5. Keep authentication logic centralized in the auth feature
6. Use TypeScript types for type safety
7. Follow the principle of least privilege when assigning roles and permissions 