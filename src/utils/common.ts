export const toTitleCase = (value?: string) => {
    if (!value) return '';

    if (value.startsWith('DAR-'))
      return 'Dar es Salaam';

    // Remove non-alphabetic characters except spaces
    const cleaned = value.replace(/[^a-zA-Z\s]/g, ' ');
  
    // Convert multiple spaces to single space and trim
    const normalized = cleaned.replace(/\s+/g, ' ').trim();
  
    // Capitalize first letter of each word
    return normalized
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

export const formatter = new Intl.NumberFormat('en-US');
  
  