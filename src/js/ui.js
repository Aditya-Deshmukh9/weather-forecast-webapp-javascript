const Loader = document.getElementById("loader");
const weatherDataSection = document.getElementById("current-city-data");
const messageSection = document.getElementById("front-message");

export function showLoader() {
  Loader.classList.remove("hidden");
  Loader.classList.add("flex");
  weatherDataSection.classList.add("hidden");
  messageSection.classList.add("hidden");
}

export function hideLoader() {
  Loader.classList.add("hidden");
  Loader.classList.remove("flex");
  weatherDataSection.classList.remove("hidden");
}

export function showWeatherData() {
  weatherDataSection.classList.remove("hidden");
  weatherDataSection.classList.add("visible");
  messageSection.classList.add("hidden");
}

export function showMessage(message) {
  messageSection.classList.remove("hidden");
  messageSection.classList.add("flex");
  messageSection.innerHTML = `
    <p>${message}</p>
    <p>TRY SEARCH CITY</p>
    <button id="search-city-btn" class="btn">Search City</button>
  `;

  weatherDataSection.classList.add("hidden");

  // event listener to "Search City" button
  const searchCityBtn = document.getElementById("search-city-btn");
  searchCityBtn.addEventListener("click", () => {
    // Trigger city search when the button is clicked
    document.getElementById("city-input").focus();
  });
}
