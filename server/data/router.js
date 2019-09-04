"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { Month, Gig } = require("./models");
const { JWT_SECRET: secret } = require("../../config");

const router = express.Router();

const jsonParser = bodyParser.json();

// fix deprecation warning
mongoose.set("useFindAndModify", false);
mongoose.set("debug", true);

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

// helper functions
function authKeyword(res) {
  return res.status(401).json({
    message: "Unauthorized Access; Invalid Keyword"
  });
}
// create handle error function

// Month route
router.post("/month", jsonParser, async (req, res) => {
  const { month, year, keyword } = req.body;

  if (!keyword || keyword !== secret) {
    return authKeyword(res);
  }

  try {
    const monthData = await Month.findOne({
      month,
      year
    });
    const monthName = monthNameArr[month - 1];
    if (monthData) {
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

router.get("/month/", async (req, res) => {
  const year = req.query.year;
  try {
    const monthData = await Month.find({ year })
      .select("-__v")
      .populate("dates", "-__v -monthId");

    res.status(200).json({ monthData });
  } catch (err) {
    res.status(404).json({ message: "Error; could not retrieve data" });
  }
});

router.get("/month/:id", async (req, res) => {
  const monthId = req.params.id;

  try {
    const monthData = await Month.findById(monthId).populate(
      "dates",
      "-__v -monthId"
    );
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

router.delete("/month/:month", async (req, res) => {
  const month = req.params.month;

  // add functionality to delete gigs along with month

  try {
    const deletedMonth = await Month.findOneAndDelete({
      month
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
  const {
    month,
    year,
    days,
    dates,
    time,
    name,
    type,
    location,
    url,
    keyword
  } = req.body;

  if (!keyword || keyword !== secret) {
    return authKeyword(res);
  }

  // check for duplicate gig
  try {
    const gigData = await Gig.findOne({
      days,
      dates
    });
    if (gigData) {
      return res.status(405).json({
        message: "Error: Gig data already exists",
        gigData
      });
    } else {
      // get Month
      let monthData = await Month.findOne({
        month,
        year
      });

      let newMonth;

      if (!monthData) {
        const monthName = monthNameArr[month - 1];

        newMonth = await Month.create({
          year,
          month,
          month_name: monthName
        });
      }
      const monthId = monthData._id || newMonth._id;

      console.log(monthId);
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
            dates: newGig
          }
        },
        { upsert: false, new: true }
      ).exec();

      res.status(201).json({
        message: "Gig recorded succesfully ",
        updateMonth,
        newGig: newGig.serialize()
      });
    }
  } catch (err) {
    res.status(422).json({ err, message: "Error, could not post Gig" });
  }
});

router.delete("/:id", async (req, res) => {
  const gigId = req.params.id;

  try {
    const gigData = await Gig.findById(gigId);
    if (!gigData) {
      res.status(404).json({ message: "Error: Gig does not exist", gigData });
    } else {
      const gig = await Gig.findByIdAndDelete(gigId);
      const monthId = gig.monthId;
      const updateMonth = await Month.findByIdAndUpdate(
        monthId,
        {
          $pull: {
            dates: gigId
          }
        },
        { new: true }
      );

      res.status(201).json({
        message: "Gig removed from database",
        updatedMonth: updateMonth.serialize(),
        removedGig: gig.serialize()
      });
    }
  } catch (err) {
    res.status(422).json({ err, message: "Error, could not delete gig" });
  }
});

module.exports = { router };
