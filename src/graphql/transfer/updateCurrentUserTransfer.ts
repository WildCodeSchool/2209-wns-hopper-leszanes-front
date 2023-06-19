import { gql } from "@apollo/client";

export const updateCurrentUserTransfer = gql`
  mutation Mutation($data: TransferCurrentUserUpdateInput!) {
    updateCurrentUserTransfer(data: $data) {
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
