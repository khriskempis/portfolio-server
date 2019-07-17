"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const GigSchema = mongoose.Schema({
  month: { type: String },
  days: { type: String },
  dates: { type: String },
  name: { type: String },
  type: { type: String },
  location: { type: String }
});

const Gigs = mongoose.model("Gigs", GigSchema);

module.exports = { Gigs };
