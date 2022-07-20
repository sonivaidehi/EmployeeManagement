/**
 * auth.js
 * @description :: middleware that checks authentication and authorization of user
 */

const passport = require("passport");
const { ROLE } = require("../config/constant");

/**
 * @description : returns callback that verifies required rights and access
 * @param {Object} req : request of route.
 * @param {callback} resolve : resolve callback for succeeding method.
 * @param {callback} reject : reject callback for error.
 * @param {int} platform : platform
 */
const verifyCallback =
  (req, resolve, reject, platform) => async (error, user, info) => {
    if (error || info || !user) {
      return reject("Unauthorized User");
    }
    req.user = user;
    if (!user.isActive) {
      return reject("User is deactivated");
    }
    resolve();
  };

/**
 * @description : authentication middleware for request.
 * @param {Object} req : request of route.
 * @param {Object} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 * @param {int} role : role of a user
 */
const auth = (role) => async (req, res, next) => {
  // check if role is ADMIN
  if (role == ROLE.ADMIN) {
    return new Promise((resolve, reject) => {
      // apply admin-rule for authorization
      passport.authenticate(
        "admin-rule",
        { session: false },
        verifyCallback(req, resolve, reject, role)
      )(req, res, next);
    })
      .then(() => next())
      .catch((error) => {
        return res.unAuthorized({ message: error.message });
      });
  } else if (role == ROLE.EMPLOYEE) {
    // apply employee-rule for authorization
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "employee-rule",
        { session: false },
        verifyCallback(req, resolve, reject, role)
      )(req, res, next);
    })
      .then(() => next())
      .catch((error) => {
        return res.unAuthorized({ message: error.message });
      });
  }
};

module.exports = auth;
