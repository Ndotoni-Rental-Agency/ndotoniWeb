/* Communication & Engagement GraphQL (manual until schema codegen is refreshed). */

// ─── User-facing ─────────────────────────────────────────────────────────────

export const getMyNotifications = /* GraphQL */ `
  query GetMyNotifications($limit: Int, $nextToken: String) {
    getMyNotifications(limit: $limit, nextToken: $nextToken) {
      notifications {
        notificationId
        userId
        sortKey
        type
        title
        body
        imageUrl
        actionUrl
        relatedEntityType
        relatedEntityId
        isRead
        readAt
        createdAt
      }
      nextToken
      count
    }
  }
`;

export const getUnreadNotificationCount = /* GraphQL */ `
  query GetUnreadNotificationCount {
    getUnreadNotificationCount {
      count
    }
  }
`;

export const getCommunicationPreferences = /* GraphQL */ `
  query GetCommunicationPreferences {
    getCommunicationPreferences {
      emailNotifications
      smsNotifications
      pushNotifications
      marketingEmailsOptIn
    }
  }
`;

export const markNotificationRead = /* GraphQL */ `
  mutation MarkNotificationRead($sortKey: String!) {
    markNotificationRead(sortKey: $sortKey) {
      success
      message
    }
  }
`;

export const markAllNotificationsRead = /* GraphQL */ `
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      success
      message
    }
  }
`;

export const updateCommunicationPreferences = /* GraphQL */ `
  mutation UpdateCommunicationPreferences($input: UpdateCommunicationPreferencesInput!) {
    updateCommunicationPreferences(input: $input) {
      emailNotifications
      smsNotifications
      pushNotifications
      marketingEmailsOptIn
    }
  }
`;

// ─── Admin ───────────────────────────────────────────────────────────────────

export const listCommunicationTemplates = /* GraphQL */ `
  query ListCommunicationTemplates($limit: Int, $nextToken: String) {
    listCommunicationTemplates(limit: $limit, nextToken: $nextToken) {
      templates {
        templateId
        key
        name
        category
        channels
        emailSubject
        emailBody
        pushTitle
        pushBody
        inAppTitle
        inAppBody
        variables
        isActive
        updatedBy
        updatedAt
        createdAt
      }
      nextToken
      count
    }
  }
`;

export const getCommunicationTemplate = /* GraphQL */ `
  query GetCommunicationTemplate($templateId: ID!) {
    getCommunicationTemplate(templateId: $templateId) {
      templateId
      key
      name
      category
      channels
      emailSubject
      emailBody
      pushTitle
      pushBody
      inAppTitle
      inAppBody
      variables
      isActive
      updatedBy
      updatedAt
      createdAt
    }
  }
`;

export const listDeliveryLogs = /* GraphQL */ `
  query ListDeliveryLogs($limit: Int, $nextToken: String, $eventType: String) {
    listDeliveryLogs(limit: $limit, nextToken: $nextToken, eventType: $eventType) {
      logs {
        messageId
        userId
        eventType
        channel
        templateId
        status
        provider
        providerMessageId
        sentAt
        error
      }
      nextToken
      count
    }
  }
`;

export const upsertCommunicationTemplate = /* GraphQL */ `
  mutation UpsertCommunicationTemplate($input: UpsertCommunicationTemplateInput!) {
    upsertCommunicationTemplate(input: $input) {
      templateId
      key
      name
      category
      channels
      emailSubject
      emailBody
      pushTitle
      pushBody
      inAppTitle
      inAppBody
      variables
      isActive
      updatedBy
      updatedAt
      createdAt
    }
  }
`;
