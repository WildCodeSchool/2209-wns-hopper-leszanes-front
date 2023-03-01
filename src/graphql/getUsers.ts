import { gql } from "@apollo/client";

export const getUsers = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
    }
  }
`;
