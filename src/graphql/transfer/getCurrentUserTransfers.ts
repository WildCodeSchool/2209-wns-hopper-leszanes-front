import { gql } from "@apollo/client";

export const getCurrentUserTransfers = gql`
  query GetCurrentUserTransfers {
    getCurrentUserTransfers {
      id
      name
      description
      isPrivate
      createdAt
      updatedAt
      createdBy {
        id
        name
        email
      }
    }
  }
`;
