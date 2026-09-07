export interface InAppNotification {
  notificationId: string;
  userId: string;
  sortKey: string;
  type: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  actionUrl?: string | null;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface CommunicationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmailsOptIn: boolean;
}

export interface UpdateCommunicationPreferencesInput {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmailsOptIn?: boolean;
}
