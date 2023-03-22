const { User, Book } = require('../models');

const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {

    //Query me:
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id })
                .select('_v -password')
                .populate('savedBooks');

            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    //mutation: login: addUser: saveBook: removeBook:

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);

            return { token, user };
        },

        addUser: async (parent , args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user};
        },

        saveBook: async (parent, {bookToSave}, context) => {
            if(context.user) {
                const updatedBooks = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookToSave } },
                    { new: true, runValidators: true }
                ).populate('savedBooks');

                return updatedBooks;
            }
            throw new AuthenticationError('Please Login to view your saved books!');
        },

        removeBook: async (parent, {bookId}, context) => {
            if(context.user) {
                const updatedBooks = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');
                return updatedBooks;
            }
        },
    },
};

module.exports = resolvers;

