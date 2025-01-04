// apollo-client.js
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.testnet.lens.dev/graphql", // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
