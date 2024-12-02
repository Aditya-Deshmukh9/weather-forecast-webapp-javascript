import { hideLoader, showLoader, showMessage } from "./ui.js";
import { API_KEY } from "./utils.js";
import { displayWeatherData } from "./weather.js";

export function getCurrentLocationWeather() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Show loader
        showLoader();

        const res = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/today?unitGroup=metric&include=current&key=${API_KEY}&contentType=json`
        );
        const data = await res.json();

        //DISPLAY Dataa
        displayWeatherData(data);
      } catch (error) {
        console.log(error, "Failed to fetch weather for current location.");
        alert("Failed to fetch weather for current location.");
      } finally {
        hideLoader();
      }
    },
    (error) => {
      console.log("Location permission denied: ", error);

      if (error.code === 1) {
        showMessage(
          `Location access is blocked. Please enable location access to get weather data.`
        );
      }
    }
  );
}
