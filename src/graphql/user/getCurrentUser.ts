import { gql } from "@apollo/client";

export const getCurrentUser = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      name
      email
    }
  }
`;
