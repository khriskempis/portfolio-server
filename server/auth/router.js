"use strict";

const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const { JWT_SECRET: secret, JWT_EXPIRY: expiry } = require("../../config");
const router = express.Router();

const createAuthToken = user => {
  return jwt.sign({ user }, secret, {
    subject: user.username,
    expiresIn: expiry,
    algorithm: "HS256"
  });
};

const localAuth = passport.authenticate("local", { session: false });

router.use(bodyParser.json());

router.post("/login", localAuth, (req, res) => {
  console.log(req.body);
  const authToken = createAuthToken(req.user.serialize());
  res.json({ authToken });
});

const jwtAuth = passport.authenticate("jwt", { session: false });

router.post("/refresh", jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({ authToken });
});

module.exports = { router };
