import { displayWeeklyForecast } from "./forecast.js";
import { updateRecentCities } from "./localStorage.js";
import { hideLoader, showLoader } from "./ui.js";
import { API_KEY, weatherTypesImage } from "./utils.js";

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
    alert("City Not Found");
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

    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.county ||
      "City not found";

    return city;
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
    conditions,
    sunrise,
    sunset,
    uvindex,
    visibility,
  } = data.currentConditions;
  const { resolvedAddress } = data;
  const date = new Date(datetimeEpoch * 1000);
  let iconImageURL = null;

  const isLatLong =
    resolvedAddress.includes(",") && !isNaN(resolvedAddress.split(",")[0]);

  const cityName = isLatLong
    ? await fetchCityName(...resolvedAddress.split(","))
    : resolvedAddress?.split(",")[0];

  Object.entries(weatherTypesImage).forEach(([key, value]) => {
    if (icon.includes(key)) {
      iconImageURL = value;
    }
  });

  document.querySelector(".city-name").innerHTML = cityName;
  document.querySelector(".city-date").innerHTML = date.toLocaleDateString();
  document.querySelector(".temp").innerHTML = `${temp} °C`;
  document.querySelector(".city-cloud").innerHTML = conditions;
  document.querySelector(".icon").src = iconImageURL;

  document.querySelector(
    ".feels_like"
  ).innerHTML = `Real Feel<br /> ${feelslike} °C`;
  document.querySelector(".wind_speed span").innerHTML = `${windspeed} Km`;
  document.querySelector(".clouds span").innerHTML = `${cloudcover} %`;
  document.querySelector(".humidity").innerHTML = `Humidity<br />${humidity} %`;

  document.querySelector(".sun_rise").innerHTML = `Sun Rise<br /> ${sunrise}`;
  document.querySelector(".sun_set").innerHTML = `Sun Set<br />${sunset} `;
  document.querySelector(".uvindex").innerHTML = `UV index<br />${uvindex}`;
  document.querySelector(
    ".visibility"
  ).innerHTML = `Visibility<br />${visibility} Km`;

  displayWeeklyForecast(cityName);
}
