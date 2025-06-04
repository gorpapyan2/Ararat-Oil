import React from "react";
import { AuthProvider as CoreAuthProvider } from "@/core/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <CoreAuthProvider>
      {children}
    </CoreAuthProvider>
  );
}
