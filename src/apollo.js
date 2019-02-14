import ApolloClient from 'apollo-boost';
//const ApolloClient = require('apollo-boost');
require('dotenv').load();

export default new ApolloClient({
  uri: `http://localhost:3002/graphql`,
});
