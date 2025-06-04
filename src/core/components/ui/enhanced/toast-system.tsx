import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  ExternalLink,
  Copy,
  Download 
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '@/core/components/ui/button';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: ToastAction[];
  onDismiss?: () => void;
  timestamp?: Date;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
};

const TOAST_COLORS = {
  success: {
    bg: 'bg-green-50 dark:bg-green-950/50',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-900 dark:text-green-100',
    message: 'text-green-700 dark:text-green-300',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/50',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-900 dark:text-red-100',
    message: 'text-red-700 dark:text-red-300',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-900 dark:text-amber-100',
    message: 'text-amber-700 dark:text-amber-300',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-100',
    message: 'text-blue-700 dark:text-blue-300',
  },
};

const POSITION_CLASSES = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

function ToastComponent({ 
  toast, 
  onRemove 
}: { 
  toast: Toast; 
  onRemove: (id: string) => void; 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = TOAST_ICONS[toast.type];
  const colors = TOAST_COLORS[toast.type];

  const handleDismiss = () => {
    toast.onDismiss?.();
    onRemove(toast.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-lg border shadow-lg',
        'backdrop-blur-sm',
        colors.bg,
        colors.border
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress bar for non-persistent toasts */}
      {!toast.persistent && toast.duration && (
        <motion.div
          className="absolute top-0 left-0 h-1 bg-current opacity-30"
          style={{ color: colors.icon.split(' ')[0].replace('text-', '') }}
          initial={{ width: "100%" }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ 
            duration: isHovered ? 0 : (toast.duration / 1000),
            ease: "linear"
          }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', colors.icon)} />
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm font-medium', colors.title)}>
                  {toast.title}
                </p>
                {toast.message && (
                  <p className={cn('mt-1 text-sm', colors.message)}>
                    {toast.message}
                  </p>
                )}
                
                {toast.timestamp && (
                  <p className="mt-1 text-xs opacity-60">
                    {toast.timestamp.toLocaleTimeString()}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleDismiss}
                className={cn(
                  'ml-4 inline-flex rounded-md p-1.5 transition-colors',
                  'hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-current',
                  colors.icon
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Toast Actions */}
            {toast.actions && toast.actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {toast.actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={action.variant || 'outline'}
                    onClick={() => {
                      action.onClick();
                      handleDismiss();
                    }}
                    className="h-8 text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: { 
  children: React.ReactNode; 
  position?: ToastPosition;
  maxToasts?: number;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toastData: Omit<Toast, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(2);
    const newToast: Toast = {
      ...toastData,
      id,
      timestamp: new Date(),
      duration: toastData.duration ?? 5000,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto remove non-persistent toasts
    if (!toastData.persistent && newToast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      
      {/* Toast Container */}
      <div className={cn('fixed z-50 flex flex-col space-y-2', POSITION_CLASSES[position])}>
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <ToastComponent
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearAllToasts } = context;

  // Convenience methods
  const toast = {
    success: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'success', title, message, ...options }),
      
    error: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'error', title, message, ...options }),
      
    warning: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'warning', title, message, ...options }),
      
    info: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'info', title, message, ...options }),

    // Preset action toasts
    successWithAction: (title: string, actionLabel: string, actionFn: () => void, message?: string) =>
      addToast({
        type: 'success',
        title,
        message,
        actions: [{ label: actionLabel, onClick: actionFn }]
      }),

    copySuccess: (item: string = 'Text') =>
      addToast({
        type: 'success',
        title: `${item} copied to clipboard`,
        duration: 2000,
        actions: []
      }),

    downloadReady: (filename: string, downloadFn: () => void) =>
      addToast({
        type: 'success',
        title: 'Download ready',
        message: `${filename} is ready to download`,
        persistent: true,
        actions: [
          { label: 'Download', onClick: downloadFn },
          { label: 'Dismiss', onClick: () => {}, variant: 'ghost' }
        ]
      }),

    actionRequired: (title: string, message: string, actionLabel: string, actionFn: () => void) =>
      addToast({
        type: 'warning',
        title,
        message,
        persistent: true,
        actions: [
          { label: actionLabel, onClick: actionFn },
          { label: 'Later', onClick: () => {}, variant: 'ghost' }
        ]
      }),
  };

  return {
    toast,
    removeToast,
    clearAllToasts,
  };
} 