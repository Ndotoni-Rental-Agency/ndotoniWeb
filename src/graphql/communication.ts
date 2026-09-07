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
