import { gql } from "@apollo/client";

export const createTransfer = gql`
  mutation CreateTransfer($data: TransferCreateInput!) {
    createTransfer(data: $data) {
      id
      name
      description
      isPrivate
    }
  }
`;
