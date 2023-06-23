import { gql } from "@apollo/client";

export const createFile = gql`
  mutation CreateFile($data: FileCreateInput!) {
    createFile(data: $data) {
      name
      fileName
      size
      transfer {
        name
        description
      }
    }
  }
`;
