import { gql } from "@apollo/client";

export const bulkDeleteCurrentUserTransfers = gql`
  mutation BulkDeleteCurrentUserTransfers(
    $bulkDeleteCurrentUserTransfersIds: [ID!]!
  ) {
    bulkDeleteCurrentUserTransfers(ids: $bulkDeleteCurrentUserTransfersIds)
  }
`;
