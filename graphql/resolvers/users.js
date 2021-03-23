const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const User = require('../../models/User');
const chekAuth = require('../../util/check-auth');
// const { JWT_KEY} = require('../../config');

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username,
    urlImage: user.urlImage
  }, process.env.JWT_KEY, { expiresIn: '1h' });
}

// function generateToken(user) {
//   return jwt.sign({
//     id: user.id,
//     email: user.email,
//     username: user.username,
//     urlImage: user.urlImage
//   }, JWT_KEY, { expiresIn: '1h' });
// }

module.exports = {
  Mutation: {
    async login(_, { username, password }){
      const { errors, valid } = validateLoginInput(username, password);

      if(!valid){
        throw new UserInputError('Errors', { errors });
      }
      const user  = await User.findOne({ username });

      if(!user){
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if(!match){
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      }

    },
    async register(
      _,
      {registerInput: {username, email, password, confirmPassword }},
      context,
      info
    ){
      // validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if(!valid){
        throw new UserInputError('Errors', { errors });
      }
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
        createdAt: new Date().toISOString(),
        urlImage: "images/default-user.png"
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      }
    },
    async createNewAva(_, { urlImage }, context){
      const user = chekAuth(context);
      
      // const user  = await User.findOne({ username });

      // if(!user){
      //   errors.general = 'User not found';
      //   throw new UserInputError('User not found', { errors });
      // }

      let userForUpdate;

      try {
        userForUpdate = await User.findById(user.id);
      } catch (error) {
        throw new Error(error)
      }

      userForUpdate.urlImage = urlImage;

      try {
        await userForUpdate.save();
      } catch (error) {
        throw new Error(error)
      }

      return userForUpdate;

      // const userUp  = await User.findByIdAndUpdate({user.id})

      // return {
      //   ...user._doc,
      //   id: user._id,
      //   token
      // }

    }
  }
};
