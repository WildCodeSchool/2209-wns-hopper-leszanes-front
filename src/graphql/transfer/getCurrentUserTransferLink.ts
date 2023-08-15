import { gql } from "@apollo/client";

export const getCurrentUserTransferLink = gql`
  query GetCurrentUserTransferLink($getCurrentUserTransferLinkId: ID!) {
    getCurrentUserTransferLink(id: $getCurrentUserTransferLinkId) {
      token
    }
  }
`;
