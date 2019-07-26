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

GigSchema.methods.serialize = function() {
  return {
    id: this._id,
    month: this.month,
    days: this.days,
    dates: this.dates,
    name: this.name,
    type: this.type,
    location: this.location
  };
};

const Gigs = mongoose.model("Gigs", GigSchema);

module.exports = { Gigs };
