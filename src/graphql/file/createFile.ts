import { gql } from "@apollo/client";

export const createFile = gql`
  mutation CreateFile($data: FileCreateInput!) {
    createFile(data: $data) {
      name
      size
      transfer {
        name
        description
      }
    }
  }
`;
