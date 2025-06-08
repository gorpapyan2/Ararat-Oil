
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logger } from '@/utils/errorHandling';

// Define proper Toast type interface
export interface ToastType {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
}

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  
  // Toast State
  toasts: ToastType[];
  
  // Loading States
  isLoading: boolean;
  loadingMessage?: string;
  
  // Error States
  error: string | null;
  
  // User Preferences
  preferences: {
    compactMode: boolean;
    showTutorials: boolean;
    autoSave: boolean;
  };
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  addToast: (toast: Omit<ToastType, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  updatePreferences: (preferences: Partial<AppState['preferences']>) => void;
  reset: () => void;
}

const initialState = {
  sidebarCollapsed: false,
  theme: 'system' as const,
  language: 'hy',
  toasts: [],
  isLoading: false,
  loadingMessage: undefined,
  error: null,
  preferences: {
    compactMode: false,
    showTutorials: true,
    autoSave: true,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setSidebarCollapsed: (collapsed: boolean) => {
        logger.info('Sidebar collapsed state changed', { collapsed });
        set({ sidebarCollapsed: collapsed });
      },
      
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        logger.info('Theme changed', { theme });
        set({ theme });
      },
      
      setLanguage: (language: string) => {
        logger.info('Language changed', { language });
        set({ language });
      },
      
      addToast: (toast: Omit<ToastType, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ToastType = { ...toast, id };
        
        set((state) => ({
          toasts: [...state.toasts, newToast]
        }));
        
        // Auto-remove toast after duration
        if (toast.duration !== 0) {
          const duration = toast.duration || 5000;
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },
      
      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id)
        }));
      },
      
      clearToasts: () => {
        set({ toasts: [] });
      },
      
      setLoading: (loading: boolean, message?: string) => {
        set({ isLoading: loading, loadingMessage: message });
      },
      
      setError: (error: string | null) => {
        logger.error('App error set', { error });
        set({ error });
      },
      
      updatePreferences: (newPreferences: Partial<AppState['preferences']>) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        }));
      },
      
      reset: () => {
        logger.info('App store reset');
        set(initialState);
      },
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        language: state.language,
        preferences: state.preferences,
      }),
    }
  )
);

// Selectors for common use cases
export const useAppTheme = () => useAppStore((state) => state.theme);
export const useAppLanguage = () => useAppStore((state) => state.language);
export const useAppLoading = () => useAppStore((state) => ({ 
  isLoading: state.isLoading, 
  message: state.loadingMessage 
}));
export const useAppError = () => useAppStore((state) => state.error);
export const useAppPreferences = () => useAppStore((state) => state.preferences);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);

// Toast hook for easier usage
export const useToastStore = () => {
  const toasts = useAppStore((state) => state.toasts);
  const addToast = useAppStore((state) => state.addToast);
  const removeToast = useAppStore((state) => state.removeToast);
  const clearToasts = useAppStore((state) => state.clearToasts);
  
  return { toasts, addToast, removeToast, clearToasts };
};
