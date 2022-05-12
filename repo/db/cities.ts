import { City } from "../../lib/types";
import { client } from "./client";

export async function dbSelectAllCities(): Promise<City[]> {
  return await client.city.findMany();
}
