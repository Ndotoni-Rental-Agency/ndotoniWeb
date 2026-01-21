/**
 * CSV Parser utility for bulk property import
 * Handles CSV file parsing and validation
 */

export interface BulkPropertyRow {
  propertyId?: string;
  eventType: string;
  landlordEmail: string;
  managerId?: string;
  title: string;
  description: string;
}

export interface ParsedCSVResult {
  rows: BulkPropertyRow[];
  errors: string[];
}

/**
 * Parse CSV file content
 */
export function parseCSV(csvContent: string): ParsedCSVResult {
  const errors: string[] = [];
  const rows: BulkPropertyRow[] = [];
  
  // Split by lines
  const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length === 0) {
    errors.push('CSV file is empty');
    return { rows, errors };
  }
  
  // Parse header
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.trim().toLowerCase());
  
  // Validate required headers
  const requiredHeaders = ['eventtype', 'landlordemail', 'title', 'description'];
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h) && h !== 'landlordemail' || (!headers.includes('landlordemail') && !headers.includes('email')));
  
  // Check for landlord email 
  const hasLandlordEmail = headers.includes('landlordemail') || headers.includes('email');
  
  if (!hasLandlordEmail) {
    errors.push('CSV must contain "landlordEmail" or "email" column');
  }
  
  // Check other required headers
  const otherRequired = ['eventtype', 'title', 'description'];
  const missingOther = otherRequired.filter(h => !headers.includes(h));
  
  if (missingOther.length > 0) {
    errors.push(`Missing required headers: ${missingOther.join(', ')}`);
  }
  
  if (errors.length > 0) {
    return { rows, errors };
  }
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = parseCSVLine(line);
    
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
      continue;
    }
    
    // Create row object
    const row: BulkPropertyRow = {
      eventType: '',
      landlordEmail: '',
      title: '',
      description: '',
    };
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || '';
      
      switch (header) {
        case 'propertyid':
          row.propertyId = value || undefined;
          break;
        case 'eventtype':
          row.eventType = value.toUpperCase();
          break;
        case 'landlordemail':
        case 'email':
          row.landlordEmail = value;
          break;
        case 'managerid':
          row.managerId = value || undefined;
          break;
        case 'title':
          row.title = value;
          break;
        case 'description':
          row.description = value;
          break;
      }
    });
    
    // Validate row
    const rowErrors: string[] = [];
    
    if (!row.eventType) {
      rowErrors.push(`Row ${i + 1}: eventType is required`);
    } else if (row.eventType !== 'CREATE' && row.eventType !== 'UPDATE') {
      rowErrors.push(`Row ${i + 1}: eventType must be "CREATE" or "UPDATE"`);
    }
    
    if (!row.landlordEmail) {
      rowErrors.push(`Row ${i + 1}: landlordEmail is required`);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.landlordEmail)) {
      rowErrors.push(`Row ${i + 1}: landlordEmail must be a valid email address`);
    }
    
    if (!row.title) {
      rowErrors.push(`Row ${i + 1}: title is required`);
    }
    
    if (!row.description) {
      rowErrors.push(`Row ${i + 1}: description is required`);
    }
    
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      rows.push(row);
    }
  }
  
  return { rows, errors };
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  // Trim the line to remove trailing newlines/whitespace
  line = line.trim();
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field (even if line ends without a comma)
  values.push(current);
  
  // Remove quotes from field values if they were quoted
  return values.map(value => {
    if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
      return value.slice(1, -1).replace(/""/g, '"');
    }
    return value;
  });
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = (e) => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}
