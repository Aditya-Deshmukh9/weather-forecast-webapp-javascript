import { displayWeeklyForecast } from "./forecast.js";
import { updateRecentCities } from "./localStorage.js";
import { hideLoader, showLoader, showMessage } from "./ui.js";
import { API_KEY, weatherTypesImage } from "./utils.js";

export function getCurrentLocationWeather() {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;

      try {
        // Show loader
        showLoader();

        const res = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/today?unitGroup=metric&key=${API_KEY}&contentType=json`
        );
        const data = await res.json();
        displayWeatherData(data);
      } catch (error) {
        console.log(error, "Failed to fetch weather for current location.");
        alert("Failed to fetch weather for current location.");
      } finally {
        // Hide loader
        hideLoader();
      }
    },
    (error) => {
      console.log("Location permission denied: ", error);

      if (error.code === error.PERMISSION_DENIED) {
        showMessage(
          `Location access is blocked. Please enable location access to get weather data.`
        );
      } else {
        // Handle other geolocation errors
        showMessage("Error retrieving location. Please check your settings.");
      }
    }
  );
}

export async function fetchWeather(city) {
  try {
    if (!city) throw new Error("City name cannot be empty.");
    showLoader();

    const res = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&key=${API_KEY}&contentType=json`
    );
    const data = await res.json();

    if (!res) throw new Error("City not found.");
    displayWeatherData(data);
    updateRecentCities(city);
  } catch (error) {
    console.log(error);
    alert(error.message);
  } finally {
    hideLoader();
  }
}

export const fetchCityName = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    return data.address.city || "City not found";
  } catch (error) {
    console.error("Error fetching city name:", error);
  }
};

export async function displayWeatherData(data) {
  if (!data) return console.log("Not found");
  const {
    temp,
    icon,
    feelslike,
    windspeed,
    humidity,
    cloudcover,
    datetimeEpoch,
  } = data.currentConditions;
  const { resolvedAddress, description } = data;
  let iconImageURL = null;
  const date = new Date(datetimeEpoch * 1000);

  const isLatLong =
    resolvedAddress.includes(",") && !isNaN(resolvedAddress.split(",")[0]);

  const cityName = isLatLong
    ? await fetchCityName(...resolvedAddress.split(",").map(Number))
    : resolvedAddress;

  Object.keys(weatherTypesImage).forEach((key) => {
    if (icon.includes(key)) iconImageURL = weatherTypesImage[key];
  });

  document.querySelector(".city-name").innerHTML = cityName;
  document.querySelector(".city-date").innerHTML = date.toLocaleDateString();
  document.querySelector(".temp").innerHTML = `${temp} °C`;
  document.querySelector(".city-cloud").innerHTML = description;
  document.querySelector(".icon").src = iconImageURL;

  document.querySelector(
    ".feels_like"
  ).innerHTML = `Real Feel<br /> ${feelslike} °C`;
  document.querySelector(
    ".wind_speed"
  ).innerHTML = `Wind<br />${windspeed} m/s`;
  document.querySelector(".clouds").innerHTML = `Clouds<br />${cloudcover} %`;
  document.querySelector(".humidity").innerHTML = `Humidity<br />${humidity} %`;

  displayWeeklyForecast(cityName);
}
