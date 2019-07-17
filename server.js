const express = require("express");
const mongoose = require("mongoose");

const { router: gigRouter } = require("./data");
const { PORT, DATABASE_URL } = require("./config");

mongoose.Promise = global.Promise;

const app = express();

app.use(express.static("public"));

app.use("/api/gigs/", gigRouter);

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Catch all; Server Error" });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing Server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
