/**
 * WhatsApp utility functions
 */

// Distinct HSL hues used for contact avatars. Spaced evenly to maximise
// visual separation between adjacent contacts in the conversation list.
const AVATAR_HUES = [0, 30, 60, 120, 160, 200, 240, 270, 300, 340] as const;

/**
 * Returns a deterministic background + foreground color pair for a contact
 * avatar, derived from the phone number string. The same phone always maps
 * to the same color so avatars are stable across renders and reloads.
 */
export function avatarColor(phone: string): { bg: string; fg: string } {
  let hash = 0;
  for (let i = 0; i < phone.length; i++) {
    hash = (hash * 31 + phone.charCodeAt(i)) >>> 0;
  }
  const hue = AVATAR_HUES[hash % AVATAR_HUES.length];
  return {
    bg: `hsl(${hue} 55% 78%)`,
    fg: `hsl(${hue} 40% 25%)`,
  };
}

/**
 * Generate WhatsApp URL for contacting about a property
 */
export function generateWhatsAppUrl(
  whatsappNumber: string,
  propertyTitle: string,
  propertyId?: string,
  customMessage?: string
): string {
  // Clean the phone number (remove all non-numeric characters)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  
  // Construct property URL if propertyId is provided
  const propertyUrl = propertyId ? `${window.location.origin}/property/${propertyId}` : '';
  
  // Default message in Swahili with property link
  let defaultMessage = `Habari! Nimevutiwa na nyumba yako`;
  if (propertyUrl) {
    defaultMessage += `\n\nLink ya nyumba: ${propertyUrl}`;
  }
  
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