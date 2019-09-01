const express = require("express");
const bodyParser = require("body-parser");

const { User } = require("./models");
const { JWT_SECRET: secret } = require("../../config");

const router = express.Router();

const jsonParser = bodyParser.json();

router.post("/", jsonParser, async (req, res) => {
  let { username, password, firstName, lastName, keyWord } = req.body;

  if (!keyWord || keyWord !== secret) {
    return res.status(404).json({
      message: "Error: Unauthorized User Access. KeyWord Invalid."
    });
  }

  firstName = firstName.trim();
  lastName = lastName.trim();

  try {
    const userData = await User.find({ username });
    if (userData.length !== 0) {
      return res.status(404).json({
        message: "Error; User already exists",
        userData
      });
    }

    const hashedPassword = await User.hashPassword(password);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName
    });

    res.status(201).json({
      user: newUser.serialize(),
      message: "Success; User has been saved"
    });
  } catch (err) {
    res.status(404).json({
      error: err,
      message: "Error; Could not save User"
    });
  }
});

module.exports = { router };
