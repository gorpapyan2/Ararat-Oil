import type { AuthUser, AuthRole, AuthError } from '../types/auth.types';

export function isAuthenticated(user: AuthUser | null): boolean {
  return !!user;
}

export function hasRequiredRole(user: AuthUser | null, requiredRole: AuthRole): boolean {
  if (!user || !user.role) return false;

  const roleHierarchy: Record<AuthRole, number> = {
    admin: 4,
    manager: 3,
    employee: 2,
    user: 1,
  };

  const userRoleLevel = roleHierarchy[user.role as AuthRole] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole];

  return userRoleLevel >= requiredRoleLevel;
}

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}

export function formatAuthError(error: AuthError): string {
  if (error.message.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (error.message.includes('Email not confirmed')) {
    return 'Please confirm your email address';
  }
  if (error.message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long';
  }
  return error.message;
} 