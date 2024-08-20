import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { getToken } from '../utils/getToken'; // Adjust the path as needed

// Replace with your actual server URL
const SERVER_URL = 'http://localhost:4000/graphql';

// Create an HTTP link
const httpLink = new HttpLink({
  uri: SERVER_URL,
});

// Create a link to add the JWT token to each request
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the token from localStorage or other storage
  const token = getToken();
  // Add the authorization token to the headers
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Forward the request
  return forward(operation);
});

// Create the Apollo Client instance with the auth and http links
const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
