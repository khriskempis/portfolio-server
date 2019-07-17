"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const { Gigs } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();

router.get("/", async (req, res) => {
  try {
    const gigs = await Gigs.find();
    res.status(201).json({ message: "Gigs retireved", gigs });
  } catch (err) {
    res.status(422).json({ message: "Error, could not retrieve gigs" });
  }
});

router.post("/", jsonParser, async (req, res) => {
  const { month, days, dates, name, type, location } = req.body;
  try {
    const newGig = await Gigs.create({
      month,
      days,
      dates,
      name,
      type,
      location
    });
    res.status(201).json({ message: "Gig recorded succesfully " + newGig });
  } catch (err) {
    res.status.apply(422).json({ message: "Error, could not post Gig" });
  }
});

module.exports = { router };
