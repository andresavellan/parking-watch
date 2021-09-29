const loader = document.querySelector(".loader");
const btnTheyAreHere = document.querySelector(".they-are-here");
const btnWatchMyCar = document.querySelector(".watch-my-car");
const paraGraph = document.querySelector("p");
let todo = "";

//Get userPostition "They are here" by click
btnTheyAreHere.addEventListener("click", (event) => {
  todo = event.target.className;
  console.log(todo);
  paraGraph.innerHTML = "";
  console.log("Loading street....");
  loader.classList.remove("hide");
  getUserPosition();
});

//Get userPostition "Watch my car" by click
btnWatchMyCar.addEventListener("click", (event) => {
  todo = event.target.className;
  console.log(todo);
  paraGraph.innerHTML = "";
  console.log("Loading street....");
  loader.classList.remove("hide");
  getUserPosition();
});

//Get Lat and Long from GeoLocation API (browser)
const getUserPosition = () => {
  var options = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  };

  function success(pos) {
    var crd = pos.coords;
    console.log("pos: ", pos);
    //console.log("crd: ", crd.pos);
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    let latitude = crd.latitude;
    let longitude = crd.longitude;
    getAddress(latitude, longitude, todo);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    loader.classList.add("hide");
    paraGraph.insertAdjacentText(
      "afterbegin",
      `ERROR(${err.code}): ${err.message}`
    );
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
};

const getAddress = (lat, long, todo) => {
  axios
    .get("/api", {
      params: {
        latlng: lat.toString() + "," + long.toString(),
        todo: todo
      }
    })
    .then(function (res) {
      const result = JSON.parse(res.data);
      console.log("getAdress res: ", result);

      paraGraph.insertAdjacentText(
        "afterbegin",
        `
        ${result.results[0].address_components[5].long_name},
        ${result.results[0].address_components[3].long_name},
        ${result.results[0].address_components[2].long_name},
        ${result.results[0].address_components[1].long_name}
        ${result.results[0].address_components[0].long_name}
        `
      );
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
      loader.classList.add("hide");
    });
};
