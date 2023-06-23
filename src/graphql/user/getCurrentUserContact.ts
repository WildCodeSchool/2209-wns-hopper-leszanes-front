import { gql } from "@apollo/client";

export const getCurrentUserContact = gql`
  query GetCurrentUserContact($getCurrentUserContactId: ID!) {
    getCurrentUserContact(id: $getCurrentUserContactId) {
      id
      name
      email
    }
  }
`;
