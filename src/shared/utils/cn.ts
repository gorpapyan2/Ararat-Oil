import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names with Tailwind CSS
 * Uses clsx for conditional class names and tailwind-merge to handle conflicting Tailwind classes
 *
 * @example
 * ```tsx
 * <div className={cn(
 *   "base-class",
 *   condition && "conditional-class",
 *   { "object-syntax": otherCondition }
 * )}>
 *   Content
 * </div>
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
