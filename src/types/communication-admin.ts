export type CommunicationTemplateCategory = 'TRANSACTIONAL' | 'MARKETING';

export type CommunicationChannel = 'EMAIL' | 'IN_APP' | 'PUSH' | 'SMS' | 'WHATSAPP';

export type DeliveryStatus = 'SENT' | 'FAILED' | 'SUPPRESSED' | 'DELIVERED' | 'BOUNCED';

export interface CommunicationTemplate {
  templateId: string;
  key: string;
  name: string;
  category: CommunicationTemplateCategory;
  channels: CommunicationChannel[];
  emailSubject?: string | null;
  emailBody?: string | null;
  pushTitle?: string | null;
  pushBody?: string | null;
  inAppTitle?: string | null;
  inAppBody?: string | null;
  variables?: string[] | null;
  isActive: boolean;
  updatedBy?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface DeliveryLog {
  messageId: string;
  userId: string;
  eventType: string;
  channel: CommunicationChannel;
  templateId?: string | null;
  status: DeliveryStatus;
  provider?: string | null;
  providerMessageId?: string | null;
  sentAt: string;
  error?: string | null;
}

export interface UpsertCommunicationTemplateInput {
  templateId?: string;
  key: string;
  name: string;
  category: CommunicationTemplateCategory;
  channels: CommunicationChannel[];
  emailSubject?: string;
  emailBody?: string;
  pushTitle?: string;
  pushBody?: string;
  inAppTitle?: string;
  inAppBody?: string;
  variables?: string[];
  isActive?: boolean;
}

export const COMMUNICATION_CHANNELS: CommunicationChannel[] = [
  'EMAIL',
  'IN_APP',
  'PUSH',
  'SMS',
  'WHATSAPP',
];

export const TEMPLATE_CATEGORIES: CommunicationTemplateCategory[] = [
  'TRANSACTIONAL',
  'MARKETING',
];

export const DELIVERY_STATUSES: DeliveryStatus[] = [
  'SENT',
  'FAILED',
  'SUPPRESSED',
  'DELIVERED',
  'BOUNCED',
];

export const COMMON_EVENT_TYPES = [
  'USER_REGISTERED',
  'PROPERTY_VIEWED',
  'PROPERTY_SAVED',
  'OWNER_STARTED_LISTING',
  'LISTING_COMPLETED',
  'LISTING_APPROVED',
  'LISTING_REJECTED',
  'USER_INACTIVE',
  'NEW_PROPERTY_AVAILABLE',
  'CAMPAIGN_CREATED',
];

export function createEmptyTemplate(): UpsertCommunicationTemplateInput {
  return {
    key: '',
    name: '',
    category: 'TRANSACTIONAL',
    channels: ['EMAIL', 'IN_APP'],
    emailSubject: '',
    emailBody: '',
    pushTitle: '',
    pushBody: '',
    inAppTitle: '',
    inAppBody: '',
    variables: [],
    isActive: true,
  };
}

export function templateToInput(template: CommunicationTemplate): UpsertCommunicationTemplateInput {
  return {
    templateId: template.templateId,
    key: template.key,
    name: template.name,
    category: template.category,
    channels: [...template.channels],
    emailSubject: template.emailSubject ?? '',
    emailBody: template.emailBody ?? '',
    pushTitle: template.pushTitle ?? '',
    pushBody: template.pushBody ?? '',
    inAppTitle: template.inAppTitle ?? '',
    inAppBody: template.inAppBody ?? '',
    variables: template.variables ?? [],
    isActive: template.isActive,
  };
}
