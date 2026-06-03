// Mock reward payment history for the referral program

export type RewardType = 'LISTING_REWARD' | 'PROFIT_SHARE';
export type PaymentMethod = 'MPESA' | 'BANK';

export interface RewardPayment {
  id: string;
  referralId: string;
  referrerId: string;
  referrerName: string;
  referrerPhone: string;
  rewardType: RewardType;
  amountTZS: number;
  paymentMethod: PaymentMethod;
  transactionRef: string;
  paidAt: string;
  paidBy: string;
}

export const MOCK_REWARD_PAYMENTS: RewardPayment[] = [
  {
    id: 'PAY-001',
    referralId: 'REF-0001',
    referrerId: 'USR-101',
    referrerName: 'Zawadi Mwamba',
    referrerPhone: '+255 712 345 678',
    rewardType: 'LISTING_REWARD',
    amountTZS: 2000,
    paymentMethod: 'MPESA',
    transactionRef: 'MP-20260518-001',
    paidAt: '2026-05-18T09:00:00Z',
    paidBy: 'Fatuma Ally',
  },
  {
    id: 'PAY-002',
    referralId: 'REF-0001',
    referrerId: 'USR-101',
    referrerName: 'Zawadi Mwamba',
    referrerPhone: '+255 712 345 678',
    rewardType: 'PROFIT_SHARE',
    amountTZS: 8500,
    paymentMethod: 'MPESA',
    transactionRef: 'MP-20260525-002',
    paidAt: '2026-05-25T11:00:00Z',
    paidBy: 'Fatuma Ally',
  },
  {
    id: 'PAY-003',
    referralId: 'REF-0002',
    referrerId: 'USR-102',
    referrerName: 'Brian Ochieng',
    referrerPhone: '+255 765 234 567',
    rewardType: 'LISTING_REWARD',
    amountTZS: 2000,
    paymentMethod: 'MPESA',
    transactionRef: 'MP-20260522-003',
    paidAt: '2026-05-22T14:30:00Z',
    paidBy: 'Fatuma Ally',
  },
];
