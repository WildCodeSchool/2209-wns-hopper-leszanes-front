import { gql } from "@apollo/client";

export const detachContact = gql`
  mutation DetachContact($contactId: ID!, $userId: ID!) {
    detachContact(contactId: $contactId, userId: $userId)
  }
`;
