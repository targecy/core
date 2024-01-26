import { gql } from 'graphql-request';

export const Admin = gql`
  fragment AdminFragment on Admin {
    id
  }

  query GetAllAdmins {
    admins {
      ...AdminFragment
    }
  }

  query GetAdmin($id: ID!) {
    admin(id: $id) {
      ...AdminFragment
    }
  }
`;
