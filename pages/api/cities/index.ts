import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { City, HttpError } from "../../../lib/types";
import { dbSelectAllCities } from "../../../repo/db/cities";
import { fetchCurrentWeatherDescription } from "../../../repo/api/cities";

interface ResponseData {
  cities: City[] & { weatherDescription?: string };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    switch (req.method) {
      case "GET": {
        const weather = req.query["weather"];
        const cities = await dbSelectAllCities();
        if (weather && weather == "now") {
          // Fetch current weather for each city
          const citiesAndWeather = Array.of<City & { weatherDescription: string }>();
          for (const city of cities) {
            const weatherDescription = await fetchCurrentWeatherDescription(city.openWeatherId);
            citiesAndWeather.push({ ...city, weatherDescription });
          }
          return res.status(200).json({ cities: citiesAndWeather });
        }
        return res.status(200).json({ cities });
      }
      default: {
        res.setHeader("Allowed", ["GET"]);
        return res.status(405).end("Method not allowed.");
      }
    }

  } catch (e) {
    console.log(e);
    if (e instanceof HttpError) {
      return res.status(e.code).end(e.message);
    }
    return res.status(500).end("Internal server error.");
  }
}
