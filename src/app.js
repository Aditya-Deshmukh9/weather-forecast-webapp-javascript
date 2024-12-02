import { renderRecentCitiesDropdown } from "./js/localStorage.js";
import { getCurrentLocationWeather } from "./js/locationWise.js";
import { fetchWeather } from "./js/weather.js";

function app() {
  console.log("running");
  //Load data
  getCurrentLocationWeather();

  document
    .getElementById("current-location-btn")
    .addEventListener("click", () => getCurrentLocationWeather());

  document
    .getElementById("weather-search-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const city = document.getElementById("city-input").value;
      fetchWeather(city);
    });

  // React Cities data load
  renderRecentCitiesDropdown();
}

app();
