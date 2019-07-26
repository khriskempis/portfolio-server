"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const GigSchema = mongoose.Schema({
  month: { type: String },
  days: { type: String },
  dates: { type: String },
  time: { type: String },
  name: { type: String },
  type: { type: String },
  location_name: { type: String },
  location_url: { type: String }
});

GigSchema.methods.serialize = function() {
  return {
    id: this._id,
    month: this.month,
    days: this.days,
    dates: this.dates,
    time: this.time,
    name: this.name,
    type: this.type,
    location_name: this.location_name,
    location_url: this.location_url
  };
};

const Gigs = mongoose.model("Gigs", GigSchema);

module.exports = { Gigs };
