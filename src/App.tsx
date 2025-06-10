import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { ThemeProvider } from "@/shared/components/ui/theme-provider";
import { ErrorBoundary } from "@/core/components/ui/ErrorBoundary";
import { AppRoutes } from "@/core/AppRoutes";

// Create QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        console.error(`Query failed (attempt ${failureCount + 1}):`, error);
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error) => {
        console.error(`Mutation failed (attempt ${failureCount + 1}):`, error);
        return failureCount < 1;
      },
    },
  },
});

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Router>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </Router>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;

