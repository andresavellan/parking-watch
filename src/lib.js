const fs = require("fs");

//retrieve position data: Country, city, area, street and street number
const getPosition = (data) => {
  const dataObject = JSON.parse(data);
  const country = dataObject.results[0].address_components[5].long_name;
  const city = dataObject.results[0].address_components[3].short_name;
  const area = dataObject.results[0].address_components[2].short_name;
  const street = dataObject.results[0].address_components[1].long_name;
  const streetNumber = dataObject.results[0].address_components[0].long_name;

  //Store data in object
  const position = {
    country,
    city,
    area,
    street,
    streetNumber
  };
  return position;
};

//Register position in equivalent DB
const registerInDB = (position, databasePath) => {
  //if new country or first time, create a new json file and push in new position. Else push to existing
  if (fs.existsSync(databasePath + "/" + position.country + ".json")) {
    const db = require(databasePath + "/" + position.country + ".json");
    const actualDB = db;
    actualDB.push(position);
    try {
      fs.writeFileSync(
        databasePath + "/" + position.country + ".json",
        JSON.stringify(actualDB, null, 2)
      );
    } catch (err) {
      console.log("Error writing Metadata.json:" + err.message);
    }
    //Push new postion to existing .json file
  } else {
    try {
      fs.writeFileSync(
        databasePath + "/" + position.country + ".json",
        JSON.stringify([position], null, 2)
      );
    } catch (err) {
      console.log("Error writing Metadata.json:" + err.message);
    }
  }
};

const checkIfMatch = (position, databasePath) => {
  //Check if city matches
  if (fs.existsSync(databasePath + "/" + position.country + ".json")) {
    const db = require(databasePath + "/" + position.country + ".json");
    const match = db.filter((element) => element.city === position.city);

    if (match[0]) {
      console.log(
        `${
          databasePath.includes("cars") ? "CarsDB" : "AlertsDB"
        } exist and there is a match!`,
        match[0]
      );
    } else {
      console.log(
        `${
          databasePath.includes("cars") ? "CarsDB" : "AlertsDB"
        } exist but there's NO match`,
        match[0]
      );
    }
  } else {
    console.log(
      `${databasePath.includes("cars") ? "CarsDB" : "AlertsDB"} does NOT exist`
    );
  }
};

module.exports = { getPosition, registerInDB, checkIfMatch };
