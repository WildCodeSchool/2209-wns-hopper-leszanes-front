import { gql } from "@apollo/client";

export const getCurrentUserContacts = gql`
  query GetCurrentUserContacts {
    getCurrentUserContacts {
      id
      name
      email
    }
  }
`;
