import { gql } from "@apollo/client";

export const createUser = gql`
  mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;
