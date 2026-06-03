// Mock activity timeline events for referrals

export type TimelineEventType =
  | 'SUBMITTED'
  | 'STATUS_CHANGED'
  | 'NOTE_ADDED'
  | 'REWARD_PAID'
  | 'ASSIGNED'
  | 'CONTACT_ATTEMPTED'
  | 'CONTACT_SUCCESS';

export interface TimelineEvent {
  id: string;
  referralId: string;
  type: TimelineEventType;
  actor: string;
  actorRole: 'system' | 'admin' | 'referrer';
  timestamp: string;
  titleKey: string;      // translation key suffix under adminReferrals.timeline.*
  detailKey?: string;
  detail?: string;       // raw detail override (non-translatable)
  meta?: Record<string, string>;
}

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  // REF-0001 (Property Rented — full journey)
  {
    id: 'EVT-001-1',
    referralId: 'REF-0001',
    type: 'SUBMITTED',
    actor: 'Zawadi Mwamba',
    actorRole: 'referrer',
    timestamp: '2026-05-12T08:30:00Z',
    titleKey: 'eventSubmitted',
    detail: 'Referral received via web form.',
  },
  {
    id: 'EVT-001-2',
    referralId: 'REF-0001',
    type: 'ASSIGNED',
    actor: 'System',
    actorRole: 'system',
    timestamp: '2026-05-12T08:31:00Z',
    titleKey: 'eventAssigned',
    detail: 'Assigned to Fatuma Ally.',
  },
  {
    id: 'EVT-001-3',
    referralId: 'REF-0001',
    type: 'STATUS_CHANGED',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-13T10:00:00Z',
    titleKey: 'eventStatusChanged',
    detail: 'Status changed: Submitted → In Progress.',
  },
  {
    id: 'EVT-001-4',
    referralId: 'REF-0001',
    type: 'CONTACT_ATTEMPTED',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-13T10:05:00Z',
    titleKey: 'eventContactAttempted',
    detail: 'Called landlord — no answer. Sent WhatsApp.',
  },
  {
    id: 'EVT-001-5',
    referralId: 'REF-0001',
    type: 'CONTACT_SUCCESS',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-14T09:00:00Z',
    titleKey: 'eventContactSuccess',
    detail: 'Spoke with landlord. Interested in listing. Sent onboarding guide.',
  },
  {
    id: 'EVT-001-6',
    referralId: 'REF-0001',
    type: 'STATUS_CHANGED',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-18T08:00:00Z',
    titleKey: 'eventStatusChanged',
    detail: 'Status changed: In Progress → Property Listed.',
  },
  {
    id: 'EVT-001-7',
    referralId: 'REF-0001',
    type: 'REWARD_PAID',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-18T09:00:00Z',
    titleKey: 'eventRewardPaid',
    detail: 'Listing reward TZS 2,000 paid to Zawadi Mwamba via M-Pesa.',
  },
  {
    id: 'EVT-001-8',
    referralId: 'REF-0001',
    type: 'STATUS_CHANGED',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-20T10:00:00Z',
    titleKey: 'eventStatusChanged',
    detail: 'Status changed: Property Listed → Property Rented.',
  },
  {
    id: 'EVT-001-9',
    referralId: 'REF-0001',
    type: 'REWARD_PAID',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-25T11:00:00Z',
    titleKey: 'eventRewardPaid',
    detail: 'Profit share TZS 8,500 paid to Zawadi Mwamba via M-Pesa.',
  },

  // REF-0002 (Property Listed)
  {
    id: 'EVT-002-1',
    referralId: 'REF-0002',
    type: 'SUBMITTED',
    actor: 'Brian Ochieng',
    actorRole: 'referrer',
    timestamp: '2026-05-14T11:15:00Z',
    titleKey: 'eventSubmitted',
    detail: 'Referral received via web form.',
  },
  {
    id: 'EVT-002-2',
    referralId: 'REF-0002',
    type: 'STATUS_CHANGED',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-15T09:00:00Z',
    titleKey: 'eventStatusChanged',
    detail: 'Status changed: Submitted → In Progress.',
  },
  {
    id: 'EVT-002-3',
    referralId: 'REF-0002',
    type: 'CONTACT_SUCCESS',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-16T11:00:00Z',
    titleKey: 'eventContactSuccess',
    detail: 'Landlord confirmed she has a studio unit available.',
  },
  {
    id: 'EVT-002-4',
    referralId: 'REF-0002',
    type: 'STATUS_CHANGED',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-22T14:30:00Z',
    titleKey: 'eventStatusChanged',
    detail: 'Status changed: In Progress → Property Listed.',
  },
  {
    id: 'EVT-002-5',
    referralId: 'REF-0002',
    type: 'REWARD_PAID',
    actor: 'Fatuma Ally',
    actorRole: 'admin',
    timestamp: '2026-05-22T14:30:00Z',
    titleKey: 'eventRewardPaid',
    detail: 'Listing reward TZS 2,000 paid to Brian Ochieng via M-Pesa.',
  },

  // REF-0003 (In Progress)
  {
    id: 'EVT-003-1',
    referralId: 'REF-0003',
    type: 'SUBMITTED',
    actor: 'Neema Salehe',
    actorRole: 'referrer',
    timestamp: '2026-05-19T09:00:00Z',
    titleKey: 'eventSubmitted',
    detail: 'Referral received via web form.',
  },
  {
    id: 'EVT-003-2',
    referralId: 'REF-0003',
    type: 'ASSIGNED',
    actor: 'System',
    actorRole: 'system',
    timestamp: '2026-05-19T09:01:00Z',
    titleKey: 'eventAssigned',
    detail: 'Assigned to Iddi Rashid.',
  },
  {
    id: 'EVT-003-3',
    referralId: 'REF-0003',
    type: 'STATUS_CHANGED',
    actor: 'Iddi Rashid',
    actorRole: 'admin',
    timestamp: '2026-05-21T16:00:00Z',
    titleKey: 'eventStatusChanged',
    detail: 'Status changed: Submitted → In Progress.',
  },
  {
    id: 'EVT-003-4',
    referralId: 'REF-0003',
    type: 'CONTACT_ATTEMPTED',
    actor: 'Iddi Rashid',
    actorRole: 'admin',
    timestamp: '2026-05-21T16:10:00Z',
    titleKey: 'eventContactAttempted',
    detail: 'Sent WhatsApp introduction message.',
  },
];
