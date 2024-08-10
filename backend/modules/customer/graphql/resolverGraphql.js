const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel'); // Adjust the path as needed

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for the secret

const resolvers = {
  Query: {
    customerProfile: async (_, __, { token }) => {
      if (!token) throw new Error('Authentication required');
      
      try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        return await Customer.findById(decodedToken.userId); // Ensure 'userId' is correct in your token
      } catch (err) {
        throw new Error('Invalid or expired token');
      }
    },
  },
  Mutation: {
    registerUser: async (_, { firstname, lastname, email, username, password }) => {
      // Check if the email or username already exists
      const existingUser = await Customer.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        throw new Error('User with this email or username already exists.');
      }

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const newUser = new Customer({
        firstname,
        lastname,
        email,
        username,
        password: hashedPassword,
      });

      return await newUser.save();
    },

    loginUser: async (_, { username, password }) => {
      // Check if the user exists
      const user = await Customer.findOne({ username });
      if (!user) {
        throw new Error('Invalid username or password.');
      }

      // Check if the password is correct
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid username or password.');
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

      return {
        token,
        user,
      };
    }
  }
};

module.exports = resolvers;
