import { gql } from "@apollo/client";

export const createFile = gql`
  mutation CreateFile($data: FileCreateInput!) {
    createFile(data: $data) {
      name
      description
      is_private
    }
  }
`;
