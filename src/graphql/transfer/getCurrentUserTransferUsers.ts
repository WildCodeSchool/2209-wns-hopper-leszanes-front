import { gql } from "@apollo/client";

export const getCurrentUserTransferUsers = gql`
  query GetCurrentUserTransferUsers($getCurrentUserTransferUsersId: ID!) {
    getCurrentUserTransferUsers(id: $getCurrentUserTransferUsersId) {
      id
      name
      email
    }
  }
`;
