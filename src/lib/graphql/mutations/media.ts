// Media mutations
export const getMediaUploadUrl = /* GraphQL */ `
  mutation GetMediaUploadUrl($userId: ID!, $fileName: String!, $contentType: String!) {
    getMediaUploadUrl(userId: $userId, fileName: $fileName, contentType: $contentType) {
      uploadUrl
      key
      fileUrl
    }
  }
`;

export const associateMediaWithProperty = /* GraphQL */ `
  mutation AssociateMediaWithProperty($propertyId: ID!, $userId: ID!, $media: PropertyMediaInput!) {
    associateMediaWithProperty(propertyId: $propertyId, userId: $userId, media: $media) {
      propertyId
      media {
        images
        videos
        floorPlan
        virtualTour
      }
      updatedAt
    }
  }
`;