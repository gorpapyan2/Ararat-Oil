/**
 * Formats a date string or Date object into a localized string
 * 
 * @param date - Date string or Date object to format
 * @param options - Intl.DateTimeFormatOptions to customize the format
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDate:', date);
    return '';
  }
  
  try {
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Gets a relative time string (e.g., "2 days ago", "in 3 months")
 * 
 * @param date - Date string or Date object to compare
 * @returns Relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to getRelativeTime:', date);
    return '';
  }
  
  const now = new Date();
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);
  const diffInMonths = Math.round(diffInDays / 30);
  const diffInYears = Math.round(diffInDays / 365);
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  } else if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, 'month');
  } else {
    return rtf.format(diffInYears, 'year');
  }
} 