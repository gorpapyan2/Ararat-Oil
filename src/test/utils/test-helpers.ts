import { vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

/**
 * Creates a mock query client for testing
 */
export function createMockQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

/**
 * Creates a standard mock for common hooks like useToast and useTranslation
 */
export function createCommonMocks() {
  vi.mock('@/hooks/useToast', () => ({
    useToast: () => ({
      toast: vi.fn(),
    }),
  }));

  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: vi.fn(),
      },
    }),
  }));
}

/**
 * Common test setup for standard API hooks
 */
export function setupApiHookTest(mockFetchResponse: any = {}) {
  const queryClient = createMockQueryClient();
  const mockFetch = vi.fn();
  
  vi.mock('@/core/api/client', () => ({
    fetchFromApi: mockFetch,
  }));
  
  mockFetch.mockResolvedValue(mockFetchResponse);
  
  return {
    queryClient,
    mockFetch,
  };
} 