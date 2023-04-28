import { gql } from "@apollo/client";

export const deleteCurrentUserTransferId = gql`
  mutation DeleteCurrentUserTransfer($deleteCurrentUserTransferId: ID!) {
    deleteCurrentUserTransfer(id: $deleteCurrentUserTransferId)
  }
`;
