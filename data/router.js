"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { Year, Month, Gig } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();

// fix deprecation warning
mongoose.set("useFindAndModify", false);

// Year route

router.get("/year/:year", async (req, res) => {
  const year = req.params.year;

  try {
    const yearData = await Year.find({ year })
      .select("months")
      .populate({
        path: "months",
        select: "_id dates month month_name"
      })
      .exec();
    res.status(200).json(yearData.map(year => year.serialize()));
  } catch (err) {
    res.status(422).json({ err, message: "Could not retrieve year data" });
  }
});

router.get("/year/id/:id", async (req, res) => {
  const yearId = req.params.id;

  try {
    const year = await Year.findById(yearId);
    //  .select("months year")
    //   .populate({
    //   path: "months",
    //   select: "_id dates month month_name",
    //   populate: {
    //     path: "dates",
    //     select: "_id days name"
    //   }
    // });

    if (year) {
      res.status(202).json(year);
    }
  } catch (err) {
    res
      .status(422)
      .json({ err, message: "Error; Could not retrieve year data" });
  }
});

router.post("/year", jsonParser, async (req, res) => {
  const { year } = req.body;

  try {
    const yearData = await Year.find({ year });
    if (yearData.length !== 0) {
      res
        .status(420)
        .json({ message: "Error; Year data already exists", yearData })
        .end();
    } else {
      const newYear = await Year.create({
        year
      });
      res.status(201).json(newYear.serialize());
    }
  } catch (err) {
    res.status(422).json({ message: "could not create year" });
  }
});

// Month route

router.post("/month", jsonParser, async (req, res) => {
  const { month, yearId, year } = req.body;
  const monthsArr = [
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
    if (monthData.length !== 0) {
      res
        .status(420)
        .json({
          message: `Error; ${monthsArr[month - 1]} in year already exists`
        })
        .end();
    } else {
      const newMonth = await Month.create({
        year,
        month,
        month_name: monthsArr[month - 1]
      });

      const yearData = await Year.findByIdAndUpdate(
        yearId,
        {
          $push: {
            months: newMonth._id
          }
        },
        { upsert: true, new: true }
      ).exec();

      res.status(201).json({ message: "Month created", yearData, newMonth });
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
      res.status(200).json({ monthData });
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
    // const deletedMonth = await Month.findOneAndDelete({
    //   _id: monthId
    // });
    if (true) {
      // const year = deletedMonth.year;
      const year = 2018;
      const yearData = await Year.findOneAndUpdate(
        { year },
        {
          $pull: {
            months: {
              monthId
            }
          }
        },
        { new: true }
      );

      res.status(201).json({ message: "Ok: month deleted", yearData });
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
    res.status(201).json(gigs.map(gig => gig.serialize()));
  } catch (err) {
    res.status(422).json({ message: "Error, could not retrieve gigs" });
  }
});

router.post("/", jsonParser, async (req, res) => {
  const { monthId, days, dates, time, name, type, location, url } = req.body;

  // add check for duplicate gig
  try {
    const newGig = await Gig.create({
      month: monthId,
      days,
      dates,
      time,
      name,
      type,
      location,
      url
    });

    const updateMonth = await Month.findOneAndUpdate(
      monthId,
      {
        $push: {
          dates: newGig._id
        }
      },
      { upsert: true, new: true }
    ).exec();

    res.status(201).json({ message: "Gig recorded succesfully ", updateMonth });
  } catch (err) {
    res.status(422).json({ err, message: "Error, could not post Gig" });
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
    res.status(422).json({ message: "Error, could not delete gig" });
  }
});

module.exports = { router };
