import ApolloClient from 'apollo-boost';
const uri = `${process.env.REACT_APP_GQL_DOMAIN}:${
  process.env.REACT_APP_GQL_PORT
}/graphql`;
const client = new ApolloClient({
  uri: uri,
});

export default client;
