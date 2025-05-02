import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createHttpLink } from '@apollo/client';

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3000/graphql',
}));

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
