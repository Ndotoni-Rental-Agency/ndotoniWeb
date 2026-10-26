/* Communication & Engagement admin operations (manual until schema codegen is refreshed). */

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

export const listCommunicationOpportunities = /* GraphQL */ `
  query ListCommunicationOpportunities(
    $opportunityType: CommunicationOpportunityType!
    $limit: Int
    $nextToken: String
  ) {
    listCommunicationOpportunities(
      opportunityType: $opportunityType
      limit: $limit
      nextToken: $nextToken
    ) {
      opportunities {
        opportunityId
        opportunityType
        status
        bookingId
        propertyTitle
        checkInDate
        suggestedMessage
        editedMessage
        deliveryOutcomes {
          channel
          status
          detail
        }
        detectedAt
        expiresAt
        lastError
      }
      nextToken
      count
    }
  }
`;

export const approveCommunicationOpportunity = /* GraphQL */ `
  mutation ApproveCommunicationOpportunity($opportunityId: ID!, $editedMessage: String) {
    approveCommunicationOpportunity(opportunityId: $opportunityId, editedMessage: $editedMessage) {
      opportunityId
      status
      editedMessage
      approvedAt
      approvedBy
    }
  }
`;

export const dismissCommunicationOpportunity = /* GraphQL */ `
  mutation DismissCommunicationOpportunity($opportunityId: ID!) {
    dismissCommunicationOpportunity(opportunityId: $opportunityId) {
      opportunityId
      status
    }
  }
`;

export const sendCommunicationOpportunity = /* GraphQL */ `
  mutation SendCommunicationOpportunity($opportunityId: ID!) {
    sendCommunicationOpportunity(opportunityId: $opportunityId) {
      opportunityId
      status
      sentAt
      deliveryOutcomes {
        channel
        status
        detail
      }
      lastError
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
