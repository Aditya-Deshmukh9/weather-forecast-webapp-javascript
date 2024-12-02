const apiKey = "07ce56bfa0b876507b30608ddd2dce2e";
const recentCitiesKey = "recentCities";
const newapi = "8BUYE8VMACZFL5Z6VAKR99J8W";

async function fetchWeather(city) {
  try {
    if (!city) throw new Error("City name cannot be empty.");

    // Show loader
    showLoader();

    const res = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&key=${newapi}&contentType=json`
    );
    const data = await res.json();

    if (!res) throw new Error("City not found.");

    console.log(data);

    // Update the UI with the fetched data
    displayWeatherData(data);
    updateRecentCities(city);
  } catch (error) {
    console.log(error);
    alert(error.message); // Show error message in an alert
  } finally {
    // Hide loader after data fetching (success or error)
    hideLoader();
  }
}

const weatherTypesImage = {
  sunny: "../assets/sunny.png",
  cloud: "../assets/cloudy.png",
  rain: "../assets/rainy.png",
  snow: "../assets/snow.png",
  clear: "../assets/clear.png",
  wind: "../assets/wind.png",
  fog: "../assets/fog.png",
};

const fetchCityName = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    return data.address.city || "City not found";
  } catch (error) {
    console.error("Error fetching city name:", error);
    return "Error fetching city name";
  }
};

async function displayWeatherData(data) {
  console.log(data);

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

  // Update UI with weather data
  document.querySelector(".city-name").innerHTML = cityName;
  document.querySelector(".city-date").innerHTML = date.toLocaleDateString();
  document.querySelector(".temp").innerHTML = `${temp} °C`;
  document.querySelector(".city-cloud").innerHTML = description;
  document.querySelector(".icon").src = iconImageURL;

  // Display air conditions
  document.querySelector(
    ".feels_like"
  ).innerHTML = `Real Feel<br /> ${feelslike} °C`;
  document.querySelector(
    ".wind_speed"
  ).innerHTML = `Wind<br />${windspeed} m/s`;
  document.querySelector(".clouds").innerHTML = `Clouds<br />${cloudcover} %`;
  document.querySelector(".humidity").innerHTML = `Humidity<br />${humidity} %`;

  // Weekly Forecast
  displayWeeklyForecast(cityName);
}

async function displayWeeklyForecast(cityName) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}/last7days?unitGroup=metric&include=days&key=${newapi}&contentType=json`
    );

    if (!response.ok) throw new Error("City not found.");
    const data = await response.json();

    // Prepare display data
    const displayData = data.days.map((day) => {
      const { datetimeEpoch, temp, windspeed, cloudcover, humidity, icon } =
        day;
      let iconImageURL = null;

      const date = new Date(datetimeEpoch * 1000);

      Object.keys(weatherTypesImage).forEach((key) => {
        if (icon.includes(key)) iconImageURL = weatherTypesImage[key];
      });

      return {
        date,
        temp,
        windspeed,
        cloudcover,
        humidity,
        iconImageURL,
        icon,
      };
    });

    // Generate HTML
    const forecastHTML = `
      <div class="w-full rounded-md p-4 flex flex-col gap-y-4">
        <h2 class="font-semibold text-lg mb-4 text-center">
          WEEKLY FORECAST
        </h2>
        <div class="w-full grid grid-cols-3 grid-rows-${
          displayData.length
        } gap-1">
          ${displayData
            .map(
              (forecast) => `
                <h3 class="text-start">${forecast.date.toLocaleDateString()}</h3>
                <h3 class="text-center">${forecast.temp} °C</h3>
                <h3 class="text-end">${forecast.windspeed.toFixed(2)} m/s</h3>
                <div class="text-start">
                  <img src="${forecast.iconImageURL}" alt="${
                forecast.icon
              }" class="inline-block w-7 h-7" />
                </div>
                <h3 class="text-center">${forecast.humidity} %</h3>
                <h3 class="text-end">${forecast.cloudcover} %</h3>
              `
            )
            .join("")}
        </div>
      </div>
    `;

    // Render HTML
    document.getElementById("forecastContainer").innerHTML = forecastHTML;
  } catch (error) {
    console.error(error);
    document.getElementById(
      "forecastContainer"
    ).innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
  }
}

function getCurrentLocationWeather() {
  console.log("open weather");

  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    console.log(latitude, longitude);

    try {
      // Show loader
      showLoader();

      const res = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/today?unitGroup=metric&key=${newapi}&contentType=json`
      );
      const data = await res.json();
      displayWeatherData(data);
    } catch (error) {
      console.log(error, "Failed to fetch weather for current location.");
      alert("Failed to fetch weather for current location.");
    } finally {
      // Hide loader
      hideLoader();
      showWeatherData();
    }
  });
}

function updateRecentCities(city) {
  let recentCities = JSON.parse(localStorage.getItem(recentCitiesKey)) || [];
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    if (recentCities.length > 5) recentCities.shift(); // Keep only 5 recent cities
    localStorage.setItem(recentCitiesKey, JSON.stringify(recentCities));
  }
  renderRecentCitiesDropdown(recentCities);
}

function renderRecentCitiesDropdown() {
  const recentCities = JSON.parse(localStorage.getItem(recentCitiesKey)) || [];
  const dropdown = document.getElementById("recent-cities-dropdown");

  dropdown.innerHTML = "<option value=''>Recent Cities</option>"; // Clear previous options and set the default

  // Add recent cities to the dropdown
  if (recentCities.length > 0) {
    recentCities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;

      // Add the option to the dropdown
      dropdown.appendChild(option);
    });

    // Add event listener to handle city selection
    dropdown.addEventListener("change", (event) => {
      const selectedCity = event.target.value;
      if (selectedCity) {
        fetchWeather(selectedCity); // Fetch weather for the selected city
      }
    });
  } else {
    const noCitiesOption = document.createElement("option");
    noCitiesOption.value = "";
    noCitiesOption.textContent = "No recent cities available";
    dropdown.appendChild(noCitiesOption);
  }
}

const Loader = document.getElementById("loader");
const weatherDataSection = document.getElementById("current-city-data");
const messageSection = document.getElementById("front-message");

function showLoader() {
  Loader.classList.remove("hidden");
  Loader.classList.add("flex");
  weatherDataSection.classList.add("hidden");
  messageSection.classList.add("hidden");
}

function hideLoader() {
  Loader.classList.add("hidden");
  Loader.classList.remove("flex");
  weatherDataSection.classList.remove("hidden");
}

function showWeatherData() {
  weatherDataSection.classList.remove("hidden");
  weatherDataSection.classList.add("visible");
  messageSection.classList.add("hidden");
}

function showMessage() {
  messageSection.classList.remove("hidden");
  messageSection.classList.add("flex");
  weatherDataSection.classList.add("hidden");
}

function init() {
  // Load recent cities and render dropdown
  const recentCities = JSON.parse(localStorage.getItem(recentCitiesKey)) || [];
  console.log(recentCities);

  if (recentCities.length === 0) {
    // No city searched yet, show message
    showMessage();
  } else {
    // Recent city found, show weather data
    showWeatherData();
  }

  // Event listeners
  document
    .getElementById("weather-search-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const city = document.getElementById("city-input").value.trim();
      console.log(city);

      if (city) {
        fetchWeather(city);
      } else {
        alert("Please enter a city name.");
      }
    });

  document
    .getElementById("current-location-btn")
    .addEventListener("click", async () => {
      console.log("click");

      await getCurrentLocationWeather();
    });

  renderRecentCitiesDropdown(recentCities);
}

init();
