"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const { Gigs } = require("/models");

const router = express.Router();

const jsonParser = bodyParser.json();
