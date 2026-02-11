/**
 * Guest Contact Validation (Client-side)
 * Validation utilities for guest user contact information in the frontend
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate phone number format for guest users
 * Validates that phone numbers contain 10-15 digits with valid formatting characters
 */
export function validatePhoneNumber(phoneNumber: string): ValidationResult {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  const trimmed = phoneNumber.trim();
  
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  // Check for valid formatting characters only
  const validCharsRegex = /^[0-9\s\-\(\)\+]+$/;
  if (!validCharsRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Phone number contains invalid characters'
    };
  }

  // Extract digits only to check length
  const digitsOnly = trimmed.replace(/\D/g, '');
  const digitCount = digitsOnly.length;

  if (digitCount < 10) {
    return {
      isValid: false,
      error: 'Phone number must contain at least 10 digits'
    };
  }

  if (digitCount > 15) {
    return {
      isValid: false,
      error: 'Phone number must not exceed 15 digits'
    };
  }

  return { isValid: true };
}

/**
 * Validate email format for guest users
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const trimmed = email.trim();
  
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const atIndex = trimmed.indexOf('@');
  if (atIndex === -1 || atIndex === 0) {
    return {
      isValid: false,
      error: 'Email must contain @ symbol and domain'
    };
  }

  const domain = trimmed.substring(atIndex + 1);
  if (domain.trim().length === 0) {
    return {
      isValid: false,
      error: 'Email must contain @ symbol and domain'
    };
  }

  return { isValid: true };
}

/**
 * Validate contact information completeness for guest users
 */
export function validateContactCompleteness(
  phoneNumber?: string,
  whatsappNumber?: string,
  email?: string
): ValidationResult {
  if (!phoneNumber || phoneNumber.trim().length === 0) {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  const hasWhatsapp = whatsappNumber && whatsappNumber.trim().length > 0;
  const hasEmail = email && email.trim().length > 0;

  if (!hasWhatsapp && !hasEmail) {
    return {
      isValid: false,
      error: 'Either WhatsApp number or email address is required'
    };
  }

  return { isValid: true };
}
