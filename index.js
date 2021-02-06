const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

const Post = require('./models/post');

const typeDefs = gql`
  type Post{
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getPosts: [Post]
  }
`;

const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});

// 8odgNcDjWUN97VG3
// mongodb+srv://david:<password>@cluster0.w5na0.mongodb.net/<dbname>?retryWrites=true&w=majority

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w5na0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected')
  return server.listen({ port: process.env.PORT || 5000});
})
.then(res => {
  console.log(`Server running at port ${res.url}`)
})
.catch(error => {
  console.log(error)
});