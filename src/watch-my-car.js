const path = require("path");
const lib = require("./lib");

//Database path to Alerts
const DB_Path_Alerts = path.join(__dirname, "../db/alerts");
const DB_Path_Cars = path.join(__dirname, "../db/cars");

const watchMyCar = (position) => {
  //Register postion in Alerts DB
  lib.registerInDB(position, DB_Path_Cars);
  //Check if Alert position.city is in Cars DB
  return lib.checkIfMatch(position, DB_Path_Alerts);
};

module.exports = watchMyCar;
