/**
 * Phone number validation utilities
 */

import { 
  isValidPhoneNumber, 
  formatPhoneNumberIntl, 
  parsePhoneNumber as parsePhoneNumberRPN 
} from 'react-phone-number-input';

/**
 * Validate phone number using react-phone-number-input
 * This handles international validation properly
 */
export function validateInternationalPhone(phone: string): boolean {
  if (!phone) return false;
  
  try {
    return isValidPhoneNumber(phone);
  } catch {
    return false;
  }
}

/**
 * Normalize phone number to E.164 format
 * Uses react-phone-number-input for proper formatting
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  
  try {
    const phoneNumber = parsePhoneNumberRPN(phone);
    return phoneNumber ? phoneNumber.format('E.164') : phone;
  } catch {
    return phone;
  }
}

/**
 * Format phone number for display
 * Uses react-phone-number-input for proper formatting
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  try {
    return formatPhoneNumberIntl(phone) || phone;
  } catch {
    return phone;
  }
}

/**
 * Get example phone numbers for different regions
 */
export function getPhoneExamples(): { [key: string]: string } {
  return {
    'Tanzania (Local)': '0712 345 678',
    'Tanzania (International)': '+255 712 345 678',
    'Kenya': '+254 712 345 678',
    'Uganda': '+256 712 345 678',
    'USA': '+1 234 567 8900',
    'UK': '+44 123 456 789',
    'South Africa': '+27 123 456 789',
    'Nigeria': '+234 123 456 789',
    'Ghana': '+233 123 456 789',
  };
}