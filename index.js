const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
type Query{
  sayHi: String
}
`