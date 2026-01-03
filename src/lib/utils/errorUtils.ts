/**
 * Extracts error message from different error formats (GraphQL, Error instances, etc.)
 */
export function extractErrorMessage(error: unknown, fallbackMessage: string = 'An error occurred'): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    // Handle GraphQL error structure
    if ((error as any).errors && Array.isArray((error as any).errors) && (error as any).errors.length > 0) {
      return (error as any).errors[0].message || fallbackMessage;
    }
    
    // Handle object with message property
    if ((error as any).message) {
      return (error as any).message;
    }
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return fallbackMessage;
}

/**
 * Checks if an error indicates the user needs email verification
 */
export function isUserNotConfirmedError(error: unknown): boolean {
  const message = extractErrorMessage(error);
  return message.includes('User is not confirmed') || message.includes('not confirmed');
}

/**
 * Checks if an error indicates rate limiting from Cognito
 */
export function isRateLimitError(error: unknown): boolean {
  const message = extractErrorMessage(error).toLowerCase();
  return message.includes('attempt limit exceeded') || 
         message.includes('too many requests') ||
         message.includes('rate limit') ||
         message.includes('try after some time');
}

/**
 * Gets user-friendly error message for common authentication errors
 */
export function getFriendlyErrorMessage(error: unknown): string {
  const message = extractErrorMessage(error);
  
  if (isRateLimitError(error)) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  
  if (isUserNotConfirmedError(error)) {
    return 'Your account needs to be verified. Please check your email for the verification code.';
  }
  
  // Return original message for other errors
  return message;
}