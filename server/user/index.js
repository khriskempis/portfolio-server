"use strict";

const { User } = require("./models");
const { router: userRouter } = require("./router");

module.exports = { User, userRouter };
