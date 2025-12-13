import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { authHttpLink, errorLink, loggerLink } from '../links';
import { GRAPHQL_URI } from '@env';

const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
});

const defaultApolloLinks = ApolloLink.from([
  errorLink,
  loggerLink,
  authHttpLink,
  httpLink,
]);

export const authenticatedDummyClient = new ApolloClient({
  link: defaultApolloLinks,
  cache: new InMemoryCache(),
});
