import { gql } from "@apollo/client";

export const getCurrentUser = gql`
  query GetCurrentUser {
    getCurrentUser {
      email
      id
      name
    }
  }
`;
