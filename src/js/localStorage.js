import { fetchWeather } from "./weather.js";

const recentCitiesKey = "recentCities";

export function updateRecentCities(city) {
  let recentCities = JSON.parse(localStorage.getItem(recentCitiesKey)) || [];
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    if (recentCities.length > 5) recentCities.shift();
    localStorage.setItem(recentCitiesKey, JSON.stringify(recentCities));
  }
  renderRecentCitiesDropdown(recentCities);
}

export function renderRecentCitiesDropdown() {
  const recentCities = JSON.parse(localStorage.getItem(recentCitiesKey)) || [];
  const dropdown = document.getElementById("recent-cities-dropdown");

  dropdown.innerHTML = "<option value=''>Recent Cities</option>";

  if (recentCities.length > 0) {
    recentCities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", (event) => {
      const selectedCity = event.target.value;
      if (selectedCity) {
        fetchWeather(selectedCity);
      }
    });
  } else {
    const noCitiesOption = document.createElement("option");
    noCitiesOption.value = "";
    noCitiesOption.textContent = "No recent cities available";
    dropdown.appendChild(noCitiesOption);
  }
}
