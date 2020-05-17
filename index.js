"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const curdRouter = require("./crudRouter");
const app = express();
app.use(bodyParser.json());
app.use("/api", curdRouter);
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}

let port = process.env.PORT || 3000;

app
  .listen(port, function () {
    console.log(`Listening at port ${port}`);
  })
  .on("error", function (error) {
    console.log(error);
  });
