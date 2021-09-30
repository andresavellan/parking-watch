const fs = require("fs");
const path = require("path");
const lib = require("./lib");
const theyAreHere = require("./they-are-here");
const watchMyCar = require("./watch-my-car");

//dependencies
const express = require("express");
const hbs = require("hbs");
const request = require("postman-request");

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

const app = express();

//Define path for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Handlebars setup and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Park Watch"
  });
});

app.get("/api", (req, res) => {
  let latAndLong = req.query.latlng;
  let todo = req.query.todo;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latAndLong}&key=${API_KEY}`;

  request({ url: url }, (error, response) => {
    if (error) {
      return console.log(error);
    }
    const data = response.body;

    //return position to user

    //Register and compare positions
    if (todo === "they-are-here") {
      const position = lib.getPosition(data);
      const matchInAlerts = theyAreHere(position);
      let positionAndMatch = {
        position: position,
        match: matchInAlerts
      };
      console.log(positionAndMatch);
      res.json(positionAndMatch);
    } else if (todo === "watch-my-car") {
      const position = lib.getPosition(data);
      const matchInAlerts = watchMyCar(position);
      let positionAndMatch = {
        position: position,
        match: matchInAlerts
      };

      console.log(positionAndMatch);
      res.json(positionAndMatch);
    }
  });
});

//Return 404 page
app.get("*", (req, res) => {
  res.render("404", {
    title: "Park Watch",
    message: "Page not found, try the menu"
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
