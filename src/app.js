import { renderRecentCitiesDropdown } from "./js/localStorage.js";
import { getCurrentLocationWeather } from "./js/locationWise.js";
import { showMessage } from "./js/ui.js";
import { fetchWeather } from "./js/weather.js";

function app() {
  console.log("running");
  //Load data
  getCurrentLocationWeather();

  const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (recentCities.length === 0) {
    showMessage(
      "Location access is blocked. Please enable location access to get weather data."
    );
  }

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
