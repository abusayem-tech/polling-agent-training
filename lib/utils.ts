import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates a Bangladeshi mobile number
 * Must be exactly 11 digits starting with 01
 */
export function isValidBangladeshiMobile(mobile: string): boolean {
  // Remove any whitespace
  const cleaned = mobile.trim();
  
  // Must be exactly 11 digits
  if (cleaned.length !== 11) {
    return false;
  }
  
  // Must start with 01
  if (!cleaned.startsWith('01')) {
    return false;
  }
  
  // Must be all digits
  if (!/^\d+$/.test(cleaned)) {
    return false;
  }
  
  return true;
}

/**
 * Normalizes a Bangladeshi mobile number for comparison
 * Returns the last 10 digits (removes leading 0)
 * This handles the case where Google Sheets automatically removes the leading 0
 */
export function normalizeMobileForComparison(mobile: string): string {
  const cleaned = mobile.trim().replace(/\D/g, ''); // Remove non-digits
  
  // If it's 11 digits starting with 0, return last 10 digits
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return cleaned.slice(1);
  }
  
  // If it's already 10 digits, return as is
  if (cleaned.length === 10) {
    return cleaned;
  }
  
  // Otherwise, return last 10 digits
  return cleaned.slice(-10);
}

