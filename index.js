const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const { DB_PASSWORD, DB_NAME, DB_USER } = require('./config');

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});


// mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w5na0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('MongoDB connected')
//   return server.listen({ port: process.env.PORT || 5000});
// })
// .then(res => {
//   console.log(`Server running at port ${res.url}`)
// })
// .catch(error => {
//   console.log(error)
// });

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.w5na0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected')
  return server.listen({ port: 5000});
})
.then(res => {
  console.log(`Server running at port ${res.url}`)
})
.catch(error => {
  console.log(error)
});