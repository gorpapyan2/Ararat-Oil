import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import logger from '@/services/logger';

// Define a type for toast notifications
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  title?: string;
}

// Define app theme type
type AppTheme = 'light' | 'dark' | 'system';

// Define the shape of our store
interface AppState {
  // Theme state
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  
  // Toast notifications state
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingText: string | null;
  setLoadingText: (text: string | null) => void;
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme state
      theme: 'system' as AppTheme,
      setTheme: (theme) => {
        set({ theme });
        
        // Apply the theme to the document
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        } else {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
        
        logger.trackAction('changed_theme', { theme });
      },
      
      // Toast notifications state
      toasts: [],
      addToast: (toast) => {
        const id = Date.now().toString();
        set((state) => ({ 
          toasts: [...state.toasts, { ...toast, id }] 
        }));
        
        // Auto-remove toast after duration
        const duration = toast.duration || 5000; // default 5 seconds
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
          }));
        }, duration);
        
        return id;
      },
      removeToast: (id) => set((state) => ({ 
        toasts: state.toasts.filter((toast) => toast.id !== id) 
      })),
      clearToasts: () => set({ toasts: [] }),
      
      // Sidebar state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      mobileSidebarOpen: false,
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      
      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      loadingText: null,
      setLoadingText: (text) => set({ loadingText: text }),
    }),
    {
      name: 'ararat-oil-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Create a hook to listen for system theme changes
export const initThemeListener = () => {
  const { theme, setTheme } = useAppStore.getState();
  
  if (theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Initial setup
    document.documentElement.classList.toggle('dark', mediaQuery.matches);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
  
  // Apply saved theme
  document.documentElement.classList.toggle('dark', theme === 'dark');
  
  return () => {}; // No cleanup needed
};

export default useAppStore; 