// Define the REGISTER_USER mutation
export const SUBMIT_REVIEW = gql`
  mutation submitReview(
    $firstname: String!,
    $lastname: String!,
    $email: String!,
    $username: String!,
    $password: String!
  ) {
    registerUser(
      firstname: $firstname,
      lastname: $lastname,
      email: $email,
      username: $username,
      password: $password
    ) {
      id
      firstname
      lastname
      email
      username
    }
  }
`;