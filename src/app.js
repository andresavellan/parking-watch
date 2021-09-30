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
    res.json(data);

    //Register and compare positions
    if (todo === "they-are-here") {
      theyAreHere(lib.getPosition(data));
    } else if (todo === "watch-my-car") {
      watchMyCar(lib.getPosition(data));
    }
  });
});

// const watchMyCar = (data) => {
//   //retrieve position data: Country, city, area, street and street number
//   const dataObject = JSON.parse(data);
//   const country = dataObject.results[0].address_components[5].long_name;
//   const city = dataObject.results[0].address_components[3].short_name;
//   const area = dataObject.results[0].address_components[2].short_name;
//   const street = dataObject.results[0].address_components[1].long_name;
//   const streetNumber = dataObject.results[0].address_components[0].long_name;

//   //Store data in object
//   const position = {
//     city,
//     area,
//     street,
//     streetNumber
//   };
//   if (fs.existsSync(DB_Path_Cars + "/" + country + ".json")) {
//     const db = require(DB_Path_Cars + "/" + country + ".json");
//     const actualDB = db;
//     actualDB.push(position);
//     try {
//       fs.writeFileSync(
//         DB_Path_Cars + "/" + country + ".json",
//         JSON.stringify(actualDB, null, 2)
//       );
//     } catch (err) {
//       console.log("Error writing Metadata.json:" + err.message);
//     }
//     //Push new postion to existing .json file
//   } else {
//     try {
//       fs.writeFileSync(
//         DB_Path_Cars + "/" + country + ".json",
//         JSON.stringify([position], null, 2)
//       );
//     } catch (err) {
//       console.log("Error writing Metadata.json:" + err.message);
//     }
//   }
// };

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
