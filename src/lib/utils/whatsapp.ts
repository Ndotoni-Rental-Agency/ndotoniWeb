/**
 * WhatsApp utility functions
 */

/**
 * Generate WhatsApp URL for contacting about a property
 */
export function generateWhatsAppUrl(
  whatsappNumber: string,
  propertyTitle: string,
  customMessage?: string
): string {
  // Clean the phone number (remove all non-numeric characters)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  
  // Default message
  const defaultMessage = `Hi! I'm interested in your property: ${propertyTitle}`;
  const message = customMessage || defaultMessage;
  
  // Generate WhatsApp URL
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Check if a WhatsApp number is valid (basic validation)
 */
export function isValidWhatsAppNumber(number: string): boolean {
  if (!number) return false;
  
  // Remove all non-numeric characters
  const cleanNumber = number.replace(/[^0-9]/g, '');
  
  // Should be at least 10 digits and at most 15 digits (international format)
  return cleanNumber.length >= 10 && cleanNumber.length <= 15;
}

/**
 * Format WhatsApp number for display
 */
export function formatWhatsAppNumber(number: string): string {
  if (!number) return '';
  
  // If it doesn't start with +, assume it needs country code
  if (!number.startsWith('+')) {
    // For Tanzania, add +255 if it starts with 0
    if (number.startsWith('0')) {
      return `+255 ${number.substring(1)}`;
    }
    // If it's already without leading 0, add +255
    return `+255 ${number}`;
  }
  
  return number;
}