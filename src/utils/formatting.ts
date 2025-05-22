/**
 * Consolidated formatting utilities
 * This file combines formatting functions that were previously duplicated across the codebase
 */

import { format } from 'date-fns';

/**
 * Formats a date using the specified format string
 * @param date The date to format
 * @param formatString The format string (defaults to standard date format)
 * @returns The formatted date string
 */
export function formatDate(date: Date | string | null | undefined, formatString = 'dd/MM/yyyy'): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (defaults to AMD)
 * @param locale The locale (defaults to hy-AM)
 * @returns The formatted currency string
 */
export function formatCurrency(amount: number | string | null | undefined, currency = 'AMD', locale = 'hy-AM'): string {
  if (amount === null || amount === undefined || amount === '') return '';
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return numericAmount.toString();
  }
}

/**
 * Formats a number with the specified number of decimal places
 * @param value The number to format
 * @param decimals The number of decimal places
 * @param locale The locale
 * @returns The formatted number string
 */
export function formatNumber(value: number | string | null | undefined, decimals = 0, locale = 'hy-AM'): string {
  if (value === null || value === undefined || value === '') return '';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numericValue);
  } catch (error) {
    console.error('Error formatting number:', error);
    return numericValue.toString();
  }
}

/**
 * Formats a percentage value
 * @param value The percentage value (0-100)
 * @param decimals The number of decimal places
 * @param locale The locale
 * @returns The formatted percentage string
 */
export function formatPercent(value: number | string | null | undefined, decimals = 0, locale = 'hy-AM'): string {
  if (value === null || value === undefined || value === '') return '';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numericValue / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${numericValue}%`;
  }
}

/**
 * Gets a readable relative time string (e.g., "2 hours ago")
 * @param date The date to format
 * @param locale The locale
 * @returns The relative time string
 */
export function getRelativeTime(date: Date | string | null | undefined, locale = 'hy-AM'): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const now = new Date();
    const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
    
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(Math.floor(diffInSeconds), 'second');
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(diffInMinutes, 'minute');
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      return rtf.format(diffInHours, 'hour');
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(diffInDays, 'day');
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      return rtf.format(diffInMonths, 'month');
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return rtf.format(diffInYears, 'year');
  } catch (error) {
    console.error('Error getting relative time:', error);
    return formatDate(date);
  }
} 