/**
 * @description : exports authentication strategy for employee using passport.js
 * @params {Object} passport : passport object for authentication
 * @return {callback} : returns callback to be used in middleware
 */
 
 const {
    Strategy, ExtractJwt 
  } = require('passport-jwt');
  const { JWT_SECRET } = require('../config/constant');
  const User = require('../models/user');
  
  const employeePassportStrategy = (passport) => {
    const options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey =JWT_SECRET.EMPLOYEE;
    passport.use('employee-rule',
      new Strategy(options, async (payload, done) => {
        try {
          const result = await User.findOne({ _id: payload.id });
          if (result) {
            return done(null, result.toJSON());
          }
          return done('No User Found', {});
        } catch (error) {
          return done(error,{});
        }
      })
    );   
  };
  
  module.exports =  employeePassportStrategy 