"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { Month, Gig } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();

// fix deprecation warning
mongoose.set("useFindAndModify", false);
mongoose.set("debug", true);

// Month route

router.post("/month", jsonParser, async (req, res) => {
  const { month, year } = req.body;
  const monthNameArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  try {
    const monthData = await Month.find({
      month,
      year
    });
    const monthName = monthNameArr[month - 1];
    if (monthData.length !== 0) {
      res.status(420).json({
        message: `Error; ${monthName} in ${year} already exists`
      });
    } else {
      const newMonth = await Month.create({
        year,
        month,
        month_name: monthName
      });

      res
        .status(201)
        .json({ message: "Month created", newMonth: newMonth.serialize() });
    }
  } catch (err) {
    res.status(422).json({ err, message: "could not create month" });
  }
});

router.get("/month/:id", async (req, res) => {
  const monthId = req.params.id;

  try {
    const monthData = await Month.findById(monthId);
    if (monthData) {
      res.status(200).json(monthData.serialize());
    } else {
      res
        .status(404)
        .json({ monthData, message: "Error: could not find Month" });
    }
  } catch (err) {
    res
      .status(422)
      .json({ err, message: "Error; Could not retrieve month data" });
  }
});

router.delete("/month/:id", async (req, res) => {
  const monthId = req.params.id;

  try {
    const deletedMonth = await Month.findOneAndDelete({
      _id: monthId
    });
    if (deletedMonth) {
      res.status(200).json({ message: "Ok: month deleted", deletedMonth });
    } else {
      res
        .status(402)
        .json({ message: `Error: month with id ${monthId} does not exist` });
    }
  } catch (err) {
    res.status(422).json({ err, message: "Error: Could not delete Month" });
  }
});

// Gig Route

router.get("/", async (req, res) => {
  try {
    const gigs = await Gig.find();
    if (gigs) {
      res.status(201).json(gigs.map(gig => gig.serialize()));
    } else {
      res.status(404).json({ message: "Could not find gigs" });
    }
  } catch (err) {
    res.status(422).json({ message: "Error, could not retrieve gigs" });
  }
});

router.post("/", jsonParser, async (req, res) => {
  const { monthId, days, dates, time, name, type, location, url } = req.body;

  // check for duplicate gig
  try {
    const gigData = await Gig.find({
      days,
      dates
    });
    if (gigData.length !== 0) {
      res.status(406).json({
        message: "Error: Gig data already exists",
        gigData
      });
    } else {
      // create gig
      const newGig = await Gig.create({
        monthId,
        days,
        dates,
        time,
        name,
        type,
        location,
        url
      });
      // add gig to month
      const updateMonth = await Month.findOneAndUpdate(
        { _id: monthId },
        {
          $push: {
            dates: newGig._id
          }
        },
        { upsert: true, new: true }
      ).exec();

      res.status(201).json({
        message: "Gig recorded succesfully ",
        updateMonth,
        newGig
      });
    }
  } catch (err) {
    res.status(422).json({ err, message: "Error, could not post Gig" });
  }
});

router.delete("/:id", async (req, res) => {
  const gigId = req.params.id;

  try {
    const gigData = await Gig.findOne({ gigId });
    if (gigData) {
      res.status(404).json({ message: "Error: Gig does not exist", gigData });
    } else {
      const gig = await Gig.findOneAndDelete({ _id: gigId });
      console.log(gig);
      if (gig) {
        const monthId = gig.monthId;
        const updateMonth = await Month.findByIdAndUpdate(
          { _id: monthId },
          {
            $pull: {
              dates: gigId
            }
          },
          { new: true }
        ).exec();
        res.status(201).json({
          message: "Gig removed from database"
          // updatedMonth: updateMonth.serialize(),
          // gig: gig.serialize()
        });
      } else {
        res.status(404).json({
          message: "Error: could not delete gig",
          updateMonth,
          monthId
        });
      }
    }
  } catch (err) {
    res.status(422).json({ message: "Error, could not delete gig" });
  }
});

module.exports = { router };
