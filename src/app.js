import { renderRecentCitiesDropdown } from "./js/localStorage.js";
import { fetchWeather, getCurrentLocationWeather } from "./js/weather.js";

function app() {
  getCurrentLocationWeather();

  document
    .getElementById("weather-search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const city = document.getElementById("weather-input").value;
      fetchWeather(city);
    });

  renderRecentCitiesDropdown();
}

document.addEventListener("DOMContentLoaded", app);
