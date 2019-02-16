import ApolloClient from 'apollo-boost';
const uri = process.env.REACT_APP_GQL_URI;
const client = new ApolloClient({
  uri: uri,
});

export default client;
