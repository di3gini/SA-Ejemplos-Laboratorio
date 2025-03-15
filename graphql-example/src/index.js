import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { books } from "./example_data/books.js";

// Define the schema
const typeDefs = `#graphql
  type Book {
    title: String
    author: String
    published_at: String
  }
  type Query {
    books: [Book]
    booksByAuthor(author: String!): [Book]
  }
  type Mutation {
    addBook(title: String!, author: String!): Book
    deleteBookByTitle(title: String!): String
    updateBookByTitle(title: String!, newTitle: String!, newAuthor: String!): String
  }
`;

// Define the resolvers
const resolvers = {
  Query: {
    books: () => books,
    booksByAuthor: (_, { author }) => {
      return books.filter(book => book.author === author);
    },
  },
  Mutation: {
    addBook: (_, { title, author }) => {
      const newBook = { title, author };
      books.push(newBook);
      return newBook;
  },
    deleteBookByTitle: (_, { title }) => {
      const bookToDelete = books.find(book => book.title === title);
      
      if (!bookToDelete) {
        return `The book with title ${title} does not exist`;
      } else {
        const index = books.findIndex(book => book.title === title);
        books.splice(index, 1);
        return `The book with title ${title} has been deleted`;
      }
  },
    updateBookByTitle: (_, { title, newTitle, newAuthor, newDate }) => {
      const bookToUpdate = books.find(book => book.title === title);
      if (!bookToUpdate) {
        return `The book with title ${title} does not exist`;
      } else {
        bookToUpdate.title = newTitle;
        bookToUpdate.author = newAuthor;
        bookToUpdate.published_at = newDate;
        const index = books.findIndex(book => book.title === title);
        books.splice(index, 1, bookToUpdate);
        return `The book with title ${title} has been updated`;
    }
  },
},
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);