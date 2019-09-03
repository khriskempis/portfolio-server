"use strict";

const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const { User } = require("../user/models");
const { JWT_SECRET: secret } = require("../../config");

// add Promise rejection, still need to fix

const localStrategy = new LocalStrategy(
  async (username, password, callback) => {
    try {
      const user = await User.find({ username });
      if (user.length !== 0) {
        return Promise.reject({
          status: "LoginError",
          message: "Error: Invalid Username or Password"
        });
      }

      const validUser = await user.validatePassword(password);

      if (!validUser) {
        return res.status(401).json({
          status: "LoginError",
          message: "Error; Invalid Username or Password"
        });
      }

      return callback(null, user);
    } catch (err) {
      if (err.reason === "LoginError") {
        return callback(null, false, err);
      }
      return callback(err, false);
    }
  }
);

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
    algorithms: ["HS256"]
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
