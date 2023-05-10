const form = document.querySelector(`form`);
const searchBtn = document.querySelector(`button`);
const previousLocations = document.querySelector(`.previous-locations`);
const currentDayForecast = document.querySelector(`#current-day-forecast`);

const currentDayLocation = document.querySelector(`#current-day-location`);

const extraDaysForecasts = document.querySelector(`#extra-days`);

const currentDayIcon = document.querySelector(`#current-day-icon`);

const API_KEY = `aa43f0596ff095c3dad63e8ba10d6ae6`;
const FORECAST_WEATHER_API = `http://api.openweathermap.org/data/2.5/forecast?`;
const LOCATION_API = `http://api.openweathermap.org/geo/1.0/direct?`;

let locationData = JSON.parse(localStorage.getItem(`locations`));

if (!locationData) {
  locationData = {};
  locationData.cities = [];
}
console.log(locationData);

form.addEventListener(`submit`, function (e) {
  e.preventDefault();
  const parent = e.target.closest(`form`);
  const inputValue = parent.children[0].value;
  if (inputValue === "") return;
  findLocation(inputValue);
});

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
      searchLocation(forecastLocation);
    });
}

function searchLocation(forecastLoc) {
  fetch(
    `${FORECAST_WEATHER_API}lat=${forecastLoc[0]}&lon=${forecastLoc[1]}&units=metric&limit=5&appid=${API_KEY}`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (resp) {
      showCurrentDayForecast(resp);
      showExtraDaysForecast(resp);
      storePrevLocation(resp);
    });
}

function showCurrentDayForecast(forecast) {
  const tempText = currentDayForecast.children[0];
  const humidText = currentDayForecast.children[1];
  const windText = currentDayForecast.children[2];

  currentDayLocation.textContent = `${forecast.city.name}, ${forecast.city.country} (Today)`;
  currentDayIcon.src = `https://openweathermap.org/img/wn/${forecast.list[0].weather[0].icon}@2x.png`;
  tempText.textContent = `Temp: ${forecast.list[0].main.temp}°`;
  humidText.textContent = `Humidity: ${forecast.list[0].main.humidity}%`;
  windText.textContent = `Wind: ${forecast.list[0].wind.speed} m/s`;
}

function showExtraDaysForecast(forecast) {
  extraDaysForecasts.innerHTML = ``;
  for (let i = 8; i < 40; i += 8) {
    if (i > 39) i = 39; //Data gets sent up to 39 timeframes

    const extraForecast = forecast.list[i];
    const html = ` <card class="day">
    <div id="day-container">
              <h2>${formatDate(extraForecast.dt_txt)}</h2>
              <img
                src="https://openweathermap.org/img/wn/${
                  extraForecast.weather[0].icon
                }@2x.png"
                alt="weather icon"
              />
            </div>
            <ul class="forecast">
              <li>Temp: ${extraForecast.main.temp}°</li>
              <li>Humidity: ${extraForecast.main.humidity}%</li>
              <li>Wind: ${extraForecast.wind.speed} m/s</li>
            </ul>
          </card>`;

    extraDaysForecasts.insertAdjacentHTML(`beforeend`, html);
  }
}

function formatDate(date) {
  // prettier-ignore
  const weekday = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];
  const day = new Date(date).getDay();
  return weekday[day];
}

function storePrevLocation(forecast) {
  const location = `${forecast.city.name}, ${forecast.city.country}`;
  locationData.cities.push(location);
  localStorage.setItem(`locations`, JSON.stringify(locationData));
  console.log(locationData);
  const html = `<div class="previous-location-container">${location}</div>`;

  previousLocations.insertAdjacentHTML(`beforeend`, html);
}

function showPrevLocations() {
  for (const location of locationData.name) {
    location;
  }
}
