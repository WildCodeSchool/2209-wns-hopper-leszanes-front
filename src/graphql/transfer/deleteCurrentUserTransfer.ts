import { gql } from "@apollo/client";

export const deleteCurrentUserTransfer = gql`
  mutation DeleteCurrentUserTransfer($deleteCurrentUserTransferId: ID!) {
    deleteCurrentUserTransfer(id: $deleteCurrentUserTransferId)
  }
`;
