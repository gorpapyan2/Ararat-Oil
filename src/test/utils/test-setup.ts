
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { vi } from 'vitest';

// Mock fetch function
export const mockFetch = vi.fn();

// Setup hook test utility
export function setupHookTest() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const renderTestHook = (hook: () => any) => {
    return renderHook(hook, { wrapper });
  };

  return {
    renderTestHook,
    mockFetch,
    queryClient,
  };
}

// Setup error test utility
export function setupErrorTest() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const renderTestHook = (hook: () => any) => {
    return renderHook(hook, { wrapper });
  };

  return {
    renderTestHook,
    mockFetch,
    queryClient,
  };
}
