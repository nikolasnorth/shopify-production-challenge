import { config } from "../../lib/config";
import { City, HttpError } from "../../lib/types";

const BASE_URL = process.env.NODE_ENV == "production" ? config.PROD_BASE_URL : config.DEV_BASE_URL;
const OPEN_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Fetches current weather from Open Weather API for the city with the given open weather id.
export async function fetchCurrentWeatherDescription(openWeatherId: number): Promise<string> {
  const params = new URLSearchParams({
    id: String(openWeatherId),
    appId: config.OPEN_WEATHER_API_KEY!,
    units: "metric",
  }).toString();
  const res = await fetch(OPEN_WEATHER_BASE_URL + "?" + params);
  if (!res.ok) {
    throw new HttpError(503, "HTTP request to Open Weather failed.");
  }
  const data = await res.json();
  const temp = data?.main?.temp;
  const desc = data?.weather[0]?.main;
  if (!temp || !desc) {
    throw new HttpError(503, "HTTP request to Open Weather responded successfully, however temperature and/or description was missing.");
  }
  return `${temp}°C, ${desc}`;
}

// Fetches from API a list of all cities.
export async function apiGetCities(): Promise<City[]> {
  const res = await fetch(`${BASE_URL}/api/cities`);
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new HttpError(res.status, errorMessage || "HTTP request failed to get cities.");
  }
  const { cities }: { cities?: City[] } = await res.json();
  if (!cities) {
    throw new Error("HTTP request to get all cities responded successfully, however cities was missing.");
  }
  return cities;
}

// Fetches from API a list of all cities and the current weather for each city.
export async function apiGetCitiesWithCurrentWeather(): Promise<(City & { weatherDescription: string })[]> {
  const params = new URLSearchParams({ weather: "now" }).toString();
  const res = await fetch(`${BASE_URL}/api/cities?${params}`);
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new HttpError(res.status, errorMessage || "HTTP request failed to get cities.");
  }
  const { cities }: { cities: (City & { weatherDescription: string })[] } = await res.json();
  if (!cities) {
    throw new Error("HTTP request to get all cities responded successfully, however cities was missing.");
  }
  return cities;
}
