import { gql } from "@apollo/client";

export const signIn = gql`
  mutation SignIn($password: String!, $email: String!) {
    signIn(password: $password, email: $email) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;
