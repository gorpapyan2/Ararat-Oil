/**
 * Shared test setup utilities for standardizing test code across the codebase
 * This file provides common test setup functions to reduce duplication in test files
 */
import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

/**
 * Create a QueryClient for testing
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

/**
 * Type for wrapper component props
 */
type WrapperProps = {
  children: React.ReactNode;
};

/**
 * Standard test setup for data fetching hooks
 * This addresses the duplication seen in test files like useTanks.test.ts,
 * useDashboard.test.ts, useEmployees.test.ts, etc.
 */
export function setupHookTest() {
  // Create a mock QueryClient
  const queryClient = createTestQueryClient();

  // Mock the fetch/API function
  const mockFetch = vi.fn();

  // Mock API client module
  vi.mock("@/core/api/client", () => ({
    fetchFromApi: mockFetch,
  }));

  // Mock toast notifications
  vi.mock("@/hooks/useToast", () => ({
    useToast: () => ({
      toast: vi.fn(),
    }),
  }));

  // Mock translations
  vi.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: vi.fn(),
      },
    }),
  }));

  // Create wrapper for QueryClientProvider
  const wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  // Helper function to render hooks with the wrapper
  const renderTestHook = <T,>(callback: () => T) => {
    return renderHook(callback, { wrapper });
  };

  return {
    queryClient,
    mockFetch,
    renderTestHook,
  };
}

/**
 * Creates a standard mock for testing error handling paths in hooks
 */
export function setupErrorTest() {
  // Create a mock QueryClient
  const queryClient = createTestQueryClient();

  // Mock the fetch/API function with error
  const mockFetch = vi.fn();
  const mockError = vi.fn();

  // Mock API client module
  vi.mock("@/core/api/client", () => ({
    fetchFromApi: mockFetch,
  }));

  // Mock toast notifications
  const mockToast = vi.fn();
  vi.mock("@/hooks/useToast", () => ({
    useToast: () => ({
      toast: mockToast,
    }),
  }));

  // Mock translations
  vi.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: vi.fn(),
      },
    }),
  }));

  // Create wrapper for QueryClientProvider
  const wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  // Helper function to render hooks with the wrapper
  const renderTestHook = <T,>(callback: () => T) => {
    return renderHook(callback, { wrapper });
  };

  return {
    queryClient,
    mockFetch,
    mockError,
    mockToast,
    renderTestHook,
  };
}

/**
 * Standard mock for mutation hooks testing
 */
export function setupMutationTest() {
  // Create a mock QueryClient with default options
  const queryClient = createTestQueryClient();

  // Mock mutation function
  const mockMutate = vi.fn();

  // Mock API client module
  vi.mock("@/core/api/client", () => ({
    fetchFromApi: mockMutate,
  }));

  // Mock toast notifications
  const mockToast = vi.fn();
  vi.mock("@/hooks/useToast", () => ({
    useToast: () => ({
      toast: mockToast,
    }),
  }));

  // Create wrapper for QueryClientProvider
  const wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  // Helper function to render hooks with the wrapper
  const renderTestHook = <T,>(callback: () => T) => {
    return renderHook(callback, { wrapper });
  };

  return {
    queryClient,
    mockMutate,
    mockToast,
    renderTestHook,
  };
}
