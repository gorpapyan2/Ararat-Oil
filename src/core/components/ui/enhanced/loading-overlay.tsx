import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, BarChart3 } from 'lucide-react';
import { cn } from '@/shared/utils';

export interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  progress?: number;
  variant?: 'default' | 'minimal' | 'branded';
  backdrop?: boolean;
  className?: string;
}

export function LoadingOverlay({
  show,
  message = 'Loading...',
  progress,
  variant = 'default',
  backdrop = true,
  className
}: LoadingOverlayProps) {
  if (!show) return null;

  const renderSpinner = () => {
    switch (variant) {
      case 'branded':
        return (
          <div className="relative">
            <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl">
              <BarChart3 className="w-8 h-8 text-white animate-pulse" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 to-purple-400/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        );
      case 'minimal':
        return (
          <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
        );
      default:
        return (
          <div className="relative">
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800"
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            backdrop && "bg-black/20 dark:bg-black/40 backdrop-blur-sm",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "flex flex-col items-center justify-center gap-6 p-8 rounded-3xl shadow-2xl",
              backdrop && "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-700/50"
            )}
          >
            {renderSpinner()}
            
            <div className="text-center space-y-2">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {message}
              </motion.p>
              
              {progress !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Additional loading states for specific use cases
export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${40 + Math.random() * 30}%` }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function CardLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
      </div>
    </motion.div>
  );
} 