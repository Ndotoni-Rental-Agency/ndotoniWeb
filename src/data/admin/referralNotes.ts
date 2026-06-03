// Mock admin notes for referrals

export interface AdminNote {
  id: string;
  referralId: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
}

export const MOCK_NOTES: AdminNote[] = [
  {
    id: 'NOTE-001-1',
    referralId: 'REF-0001',
    author: 'Fatuma Ally',
    authorInitials: 'FA',
    authorColor: 'bg-emerald-500',
    content: 'Landlord is very cooperative. Confirmed two apartments — 2-bedroom and 1-bedroom. Both unfurnished. Pricing will be set after photos.',
    createdAt: '2026-05-14T09:15:00Z',
  },
  {
    id: 'NOTE-001-2',
    referralId: 'REF-0001',
    author: 'Fatuma Ally',
    authorInitials: 'FA',
    authorColor: 'bg-emerald-500',
    content: 'Photos received and uploaded. Listing went live today. Referrer notified.',
    createdAt: '2026-05-18T08:30:00Z',
    updatedAt: '2026-05-18T08:45:00Z',
    isEdited: true,
  },
  {
    id: 'NOTE-001-3',
    referralId: 'REF-0001',
    author: 'Iddi Rashid',
    authorInitials: 'IR',
    authorColor: 'bg-blue-500',
    content: 'Rental confirmed. Tenant moved in 20 May. Profit share calculated and paid.',
    createdAt: '2026-05-25T11:10:00Z',
  },

  // REF-0002 notes
  {
    id: 'NOTE-002-1',
    referralId: 'REF-0002',
    author: 'Fatuma Ally',
    authorInitials: 'FA',
    authorColor: 'bg-emerald-500',
    content: 'Landlord responded within 2 hours. She has a furnished studio near the university. Very eager to list.',
    createdAt: '2026-05-16T11:10:00Z',
  },

  // REF-0003 notes
  {
    id: 'NOTE-003-1',
    referralId: 'REF-0003',
    author: 'Iddi Rashid',
    authorInitials: 'IR',
    authorColor: 'bg-blue-500',
    content: 'WhatsApp sent. Waiting for landlord to respond. Will follow up by phone tomorrow if no response.',
    createdAt: '2026-05-21T16:12:00Z',
  },

  // REF-0005 notes
  {
    id: 'NOTE-005-1',
    referralId: 'REF-0005',
    author: 'Fatuma Ally',
    authorInitials: 'FA',
    authorColor: 'bg-emerald-500',
    content: 'Called landlord. She confirmed three rooms: 2x single, 1x double. Available from 1 July. Will send photos this weekend.',
    createdAt: '2026-05-27T10:05:00Z',
  },
];
