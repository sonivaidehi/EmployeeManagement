const User = require("../models/user");
const dbService = require("../utils/dbService");
const { ROLE, JWT_SECRET, JWT_EXPIRE } = require("../config/constant");
const jwt = require('jsonwebtoken');
const redis = require("redis");

// method to generate JWT token and storing it in redis server
const generateToken = async (user, secret) => {
  const client = redis.createClient();
  await client.connect()
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    secret,
    { expiresIn: JWT_EXPIRE * 60 }
  );
  client.set(user.id.toString(), token);
  return token;
};

// method for authentication
const loginUser = async (username, password, role) => {
  try {
    let where = {
      $or: [{ username: username }, { email: username }],
      isActive: true,
      isDeleted: false,
      role
    };
    const user = await dbService.findOne(User, where);
    if (user) {
      if (password) {
        const isPasswordMatched = await user.isPasswordMatch(password);
        if (!isPasswordMatched) {
          return {
            errorFlag: true,
            data: "Password is wrong.",
          };
        }
        const userData = user.toJSON();
        let token;
        if (!user.role) {
          return {
            errorFlag: true,
            data: "User does not have any role assigned.",
          };
        }
        if (role === ROLE.ADMIN) {
          // generate token for platform
          token = await generateToken(userData, JWT_SECRET.ADMIN);
        } else if (role === ROLE.EMPLOYEE) {
          // generate token for platform
          token = await generateToken(userData, JWT_SECRET.EMPLOYEE)
        }
        return {
          errorFlag: false,
          data: {
            ...userData,
            token,
          },
        };
      }
    } else {
      return {
        errorFlag: true,
        data: "User not found",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
    loginUser
}