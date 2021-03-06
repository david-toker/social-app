import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000'
});

const authLink = setContext(() => {
  const token = localStorage.getItem('allHereJwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
  // cache: new InMemoryCache({
  //   typePolicies: {
  //     Query: {
  //       fields: {
  //         getPosts: {
  //           merge(existing = [], incoming: any[]) {
  //             return incoming;
  //           },
  //         },
  //       },
  //     },
  //     Post: {
  //       fields: {
  //         likes: {
  //           merge(existing = [], incoming: any[]) {
  //             return incoming;
  //           },
  //         },
  //         comments: {
  //           merge(existing = [], incoming: any[]) {
  //             return incoming;
  //           },
  //         },
  //       },
  //     },
  //   },
  // }),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)