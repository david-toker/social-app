const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/user');

module.exports = {
  Mutation: {
    async register(
      _,
      {registerInput: {username, email, password, confirmPassword }},
      context,
      info
    ){
      // make sure user doesnt exist
      const user = await User.findOne({ username });
      if(user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username
      }, process.env.JWT_KEY, { expiresIn: '1h' });

      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
};
