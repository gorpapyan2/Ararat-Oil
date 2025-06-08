
import React from 'react';

interface ProfileControllerProps {
  children: React.ReactNode;
}

export function ProfileController({ children }: ProfileControllerProps) {
  return <div>{children}</div>;
}

export default ProfileController;
