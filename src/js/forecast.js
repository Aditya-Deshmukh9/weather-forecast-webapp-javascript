import { API_KEY, weatherTypesImage } from "./utils.js";

export async function displayWeeklyForecast(cityName) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}/next7days?unitGroup=metric&include=days&key=${API_KEY}&contentType=json`
    );

    if (!response) throw new Error("City not found.");
    const data = await response.json();

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

    const forecastHTML = `
        <div class="w-full rounded-md p-4 flex flex-col gap-y-4">
          <h2 class="font-semibold text-lg mb-4 text-center">WEEKLY FORECAST</h2>
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
    document.getElementById("forecastContainer").innerHTML = forecastHTML;
  } catch (error) {
    console.error(error);
    document.getElementById(
      "forecastContainer"
    ).innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
  }
}
