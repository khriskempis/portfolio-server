"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const { Gigs } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();

router.get("/", async (req, res) => {
  try {
    const gigs = await Gigs.find();
    res.status(201).json(gigs.map(gig => gig.serialize()));
  } catch (err) {
    res.status(422).json({ message: "Error, could not retrieve gigs" });
  }
});

router.post("/", jsonParser, async (req, res) => {
  const {
    month,
    days,
    dates,
    time,
    name,
    type,
    location_name,
    location_url
  } = req.body;

  // add check for duplicate gig
  try {
    const newGig = await Gigs.create({
      month,
      days,
      dates,
      time,
      name,
      type,
      location_name,
      location_url
    });
    res.status(201).json({ message: "Gig recorded succesfully " + newGig });
  } catch (err) {
    res.status.apply(422).json({ message: "Error, could not post Gig" });
  }
});

router.delete("/:id", async (req, res) => {
  const gigId = req.params.id;

  try {
    const gig = await Gigs.findByIdAndDelete(gigId);
    if (!gig) {
      res.status(201).json({ message: "Gig removed from database" });
    }
  } catch (err) {
    res.status.apply(422).json({ message: "Error, could not delete gig" });
  }
});

module.exports = { router };
