"use strict";

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.Promise = global.Promise;

// Month

const MonthSchema = mongoose.Schema({
  year: { type: Number },
  month_name: { type: String },
  month: { type: Number },
  dates: [{ type: ObjectId, ref: "Gig" }]
});

MonthSchema.methods.serialize = function() {
  return {
    id: this._id,
    year: this.year,
    month: this.month,
    month_name: this.month_name,
    dates: this.dates
  };
};

const Month = mongoose.model("Month", MonthSchema);

// Gig

const GigSchema = mongoose.Schema({
  monthId: { type: ObjectId, ref: "Month" },
  days: { type: String },
  dates: { type: String },
  time: { type: String },
  name: { type: String },
  type: { type: String },
  location: { type: String },
  url: { type: String }
});

GigSchema.methods.serialize = function() {
  return {
    id: this._id,
    monthId: this.monthId,
    days: this.days,
    dates: this.dates,
    time: this.time,
    name: this.name,
    type: this.type,
    location: this.location_name,
    url: this.url
  };
};

const Gig = mongoose.model("Gig", GigSchema);

module.exports = { Month, Gig };
