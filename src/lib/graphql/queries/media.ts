// Media queries
export const getMediaLibrary = /* GraphQL */ `
  query GetMediaLibrary($userId: ID!) {
    getMediaLibrary(userId: $userId) {
      mediaId
      fileName
      fileUrl
      contentType
      uploadedAt
      tags
    }
  }
`;