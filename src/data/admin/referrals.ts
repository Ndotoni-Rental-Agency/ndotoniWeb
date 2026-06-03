// Mock data for the Referral Management admin module.
// All strings that appear in the UI are translation-key driven.
// Only IDs, dates, phone numbers, and non-translatable values live here.

export type ReferralStatus =
  | 'SUBMITTED'
  | 'IN_PROGRESS'
  | 'PROPERTY_LISTED'
  | 'PROPERTY_RENTED';

export type RewardStatus = 'PENDING' | 'ELIGIBLE' | 'PAID';

export interface AdminReferral {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerPhone: string;
  landlordName: string;
  landlordPhone: string;
  landlordWhatsApp: string;
  landlordEmail: string;
  area: string;
  notes: string;
  submittedAt: string; // ISO date
  updatedAt: string;
  status: ReferralStatus;
  listingRewardStatus: RewardStatus;
  profitShareRewardStatus: RewardStatus;
  listingRewardPaidAt?: string;
  profitShareRewardPaidAt?: string;
  listingRewardAmount: number; // in TZS
  profitShareAmount?: number;  // in TZS, populated when paid
  assignedTo?: string;
}

export const MOCK_REFERRALS: AdminReferral[] = [
  {
    id: 'REF-0001',
    referrerId: 'USR-101',
    referrerName: 'Zawadi Mwamba',
    referrerPhone: '+255 712 345 678',
    landlordName: 'Hassan Suleiman',
    landlordPhone: '+255 754 111 222',
    landlordWhatsApp: '+255 754 111 222',
    landlordEmail: 'hassan.s@mail.com',
    area: 'Kinondoni, Dar es Salaam',
    notes: 'Landlord has two apartments on the 3rd floor. Very responsive on WhatsApp.',
    submittedAt: '2026-05-12T08:30:00Z',
    updatedAt: '2026-05-20T10:00:00Z',
    status: 'PROPERTY_RENTED',
    listingRewardStatus: 'PAID',
    profitShareRewardStatus: 'PAID',
    listingRewardPaidAt: '2026-05-18T09:00:00Z',
    profitShareRewardPaidAt: '2026-05-25T11:00:00Z',
    listingRewardAmount: 2000,
    profitShareAmount: 8500,
    assignedTo: 'Fatuma Ally',
  },
  {
    id: 'REF-0002',
    referrerId: 'USR-102',
    referrerName: 'Brian Ochieng',
    referrerPhone: '+255 765 234 567',
    landlordName: 'Joyce Mwangi',
    landlordPhone: '+255 787 333 444',
    landlordWhatsApp: '+255 787 333 444',
    landlordEmail: '',
    area: 'Njiro, Arusha',
    notes: 'Studio apartment near UDSM branch campus. Landlord prefers female tenants.',
    submittedAt: '2026-05-14T11:15:00Z',
    updatedAt: '2026-05-22T14:30:00Z',
    status: 'PROPERTY_LISTED',
    listingRewardStatus: 'PAID',
    profitShareRewardStatus: 'PENDING',
    listingRewardPaidAt: '2026-05-22T14:30:00Z',
    listingRewardAmount: 2000,
    assignedTo: 'Fatuma Ally',
  },
  {
    id: 'REF-0003',
    referrerId: 'USR-103',
    referrerName: 'Neema Salehe',
    referrerPhone: '+255 698 456 789',
    landlordName: 'Emmanuel Shirima',
    landlordPhone: '+255 712 555 666',
    landlordWhatsApp: '+255 712 555 666',
    landlordEmail: 'e.shirima@gmail.com',
    area: 'Mwanza City Centre, Mwanza',
    notes: 'Owns a 2-bedroom house. Available from July 2026.',
    submittedAt: '2026-05-19T09:00:00Z',
    updatedAt: '2026-05-21T16:00:00Z',
    status: 'IN_PROGRESS',
    listingRewardStatus: 'PENDING',
    profitShareRewardStatus: 'PENDING',
    listingRewardAmount: 2000,
    assignedTo: 'Iddi Rashid',
  },
  {
    id: 'REF-0004',
    referrerId: 'USR-104',
    referrerName: 'Salma Juma',
    referrerPhone: '+255 755 678 901',
    landlordName: 'Peter Lyimo',
    landlordPhone: '+255 742 777 888',
    landlordWhatsApp: '',
    landlordEmail: '',
    area: 'Sinza, Dar es Salaam',
    notes: '',
    submittedAt: '2026-05-25T07:45:00Z',
    updatedAt: '2026-05-25T07:45:00Z',
    status: 'SUBMITTED',
    listingRewardStatus: 'PENDING',
    profitShareRewardStatus: 'PENDING',
    listingRewardAmount: 2000,
  },
  {
    id: 'REF-0005',
    referrerId: 'USR-105',
    referrerName: 'Daniel Kimaro',
    referrerPhone: '+255 789 012 345',
    landlordName: 'Grace Nchimbi',
    landlordPhone: '+255 765 999 000',
    landlordWhatsApp: '+255 765 999 000',
    landlordEmail: 'grace.n@company.co.tz',
    area: 'Moshi, Kilimanjaro',
    notes: 'Family friend. Very interested in listing. Has 3 rooms available.',
    submittedAt: '2026-05-26T13:00:00Z',
    updatedAt: '2026-05-27T10:00:00Z',
    status: 'IN_PROGRESS',
    listingRewardStatus: 'PENDING',
    profitShareRewardStatus: 'PENDING',
    listingRewardAmount: 2000,
    assignedTo: 'Fatuma Ally',
  },
  {
    id: 'REF-0006',
    referrerId: 'USR-106',
    referrerName: 'Amina Hassan',
    referrerPhone: '+255 712 111 222',
    landlordName: 'Robert Mwenda',
    landlordPhone: '+255 754 222 333',
    landlordWhatsApp: '+255 754 222 333',
    landlordEmail: '',
    area: 'Kahama, Shinyanga',
    notes: 'Rural property. Landlord asked about listing fees.',
    submittedAt: '2026-05-28T08:00:00Z',
    updatedAt: '2026-05-28T08:00:00Z',
    status: 'SUBMITTED',
    listingRewardStatus: 'PENDING',
    profitShareRewardStatus: 'PENDING',
    listingRewardAmount: 2000,
  },
  {
    id: 'REF-0007',
    referrerId: 'USR-101',
    referrerName: 'Zawadi Mwamba',
    referrerPhone: '+255 712 345 678',
    landlordName: 'Fatuma Komba',
    landlordPhone: '+255 787 444 555',
    landlordWhatsApp: '+255 787 444 555',
    landlordEmail: 'f.komba@mail.com',
    area: 'Msasani, Dar es Salaam',
    notes: 'Beach-side apartment. Premium property.',
    submittedAt: '2026-05-30T10:30:00Z',
    updatedAt: '2026-06-01T09:00:00Z',
    status: 'PROPERTY_LISTED',
    listingRewardStatus: 'ELIGIBLE',
    profitShareRewardStatus: 'PENDING',
    listingRewardAmount: 2000,
    assignedTo: 'Iddi Rashid',
  },
  {
    id: 'REF-0008',
    referrerId: 'USR-107',
    referrerName: 'Michael Temu',
    referrerPhone: '+255 698 333 444',
    landlordName: 'Anna Mwalimu',
    landlordPhone: '+255 712 666 777',
    landlordWhatsApp: '',
    landlordEmail: 'anna.m@school.ac.tz',
    area: 'Dodoma City, Dodoma',
    notes: 'Teacher-owned property near government area.',
    submittedAt: '2026-06-01T06:00:00Z',
    updatedAt: '2026-06-01T06:00:00Z',
    status: 'SUBMITTED',
    listingRewardStatus: 'PENDING',
    profitShareRewardStatus: 'PENDING',
    listingRewardAmount: 2000,
  },
];

export const DASHBOARD_METRICS = {
  totalReferrals: 8,
  submitted: 3,
  inProgress: 2,
  propertyListed: 2,
  propertyRented: 1,
  totalRewardsPaidTZS: 12500,
  pendingListingRewards: 2,
  pendingProfitShares: 1,
};
