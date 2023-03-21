
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        me: User
        }

type Mutation{
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(savedBook: bookInput): User
    removeBook(bookId: String!): User
}





















`









//User : _id, username, email, bookCount, savedBooks(array)

//Book: bookId, authors, description, title, image, link

//Auth: token, user