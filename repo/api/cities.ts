import { config } from "../../lib/config";
import { HttpError } from "../../lib/types";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Fetches current weather from Open Weather API for the city with the given open weather id.
export async function fetchCurrentWeatherDescription(openWeatherId: number): Promise<string> {
  const params = new URLSearchParams({
    id: String(openWeatherId),
    appId: config.OPEN_WEATHER_API_KEY!,
    units: "metric",
  }).toString();
  const res = await fetch(BASE_URL + "?" + params);
  if (!res.ok) {
    throw new HttpError(503, "HTTP request to Open Weather failed.");
  }
  const data = await res.json();
  console.log(data);
  const temp = data?.main?.temp;
  const desc = data?.weather[0]?.main;
  if (!temp || !desc) {
    throw new HttpError(503, "HTTP request to Open Weather responded successfully, however temperature and/or description was missing.");
  }
  return `${temp}°C, ${desc}`;
}
