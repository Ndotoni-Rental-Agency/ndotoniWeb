export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'support' | 'partnership' | 'property';
}

export interface Office {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  isMain: boolean;
}

export type ContactTab = 'message' | 'offices' | 'hours';
export type SubmitStatus = 'idle' | 'success' | 'error';

