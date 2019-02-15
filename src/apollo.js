import ApolloClient from 'apollo-boost';
const uri = `http://localhost:${process.env.REACT_APP_GQL_PORT}/graphql`;
const client = new ApolloClient({
  uri: () => {
    console.log(uri);
    return uri;
  },
});

export default client;
