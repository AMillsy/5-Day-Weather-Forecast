const form = document.querySelector(`form`);
const searchBtn = document.querySelector(`button`);
const previousLocations = document.querySelector(`.previous-locations`);

const API_KEY = `aa43f0596ff095c3dad63e8ba10d6ae6`;
const FORECAST_WEATHER_API = `http://api.openweathermap.org/data/2.5/forecast?`;
const LOCATION_API = `http://api.openweathermap.org/geo/1.0/direct?`;

form.addEventListener(`submit`, function (e) {
  e.preventDefault();
  const parent = e.target.closest(`form`);
  const inputValue = parent.children[0].value;
  if (inputValue === "") return;
  findLocation(inputValue);
});

function searchLocation() {}

function findLocation(inputValue) {
  let forecastLocation = [];

  fetch(`${LOCATION_API}q=${inputValue}&appid=${API_KEY}`)
    .then(function (response) {
      if (response.status !== 200) return console.log(`Location not found`);

      return response.json();
    })
    .then(function (resp) {
      if (!resp.length) return console.log(`No location found`);
      forecastLocation = [resp[0].lat, resp[0].lon];
      console.log(resp);
    });
}
