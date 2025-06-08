
import React from 'react';

export interface UserProfile {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  avatar_url?: string | null;
  updated_at?: string | null;
}

interface ProfileControllerProps {
  children: React.ReactNode;
}

export function ProfileController({ children }: ProfileControllerProps) {
  return <div>{children}</div>;
}

export { UserProfile };
export default ProfileController;
