import type { GetServerSidePropsResult } from "next";
import Head from "next/head";
import styles from "../styles/base.module.css";
import Link from "next/link";
import { Item } from "../lib/types";
import { apiGetItems } from "../repo/api/items";
import { apiGetCitiesWithCurrentWeather } from "../repo/api/cities";
import { useState } from "react";

interface Props {
  items: Item[],
  citiesInfo: { [p: string]: { cityName: string, weatherDescription: string } },
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<Props>> {
  try {
    const [items, cities] = await Promise.all([apiGetItems(), apiGetCitiesWithCurrentWeather()]);
    // Create a map of city id => (city name, weather description) pairs.
    const citiesInfoMap = new Map<number, { cityName: string, weatherDescription: string }>();
    for (const city of cities) {
      citiesInfoMap.set(city.id, { cityName: city.name, weatherDescription: city.weatherDescription });
    }
    // Convert map to an Object, so it can be serialized.
    const citiesInfo = Object.fromEntries(citiesInfoMap);
    return { props: { items, citiesInfo } };
  } catch (e) {
    console.error(e);
    return { props: { items: [], citiesInfo: {} } };
  }
}

export default function Home({ items, citiesInfo }: Props) {
  const [citiesInfoMap] = useState(new Map(Object.entries(citiesInfo)));

  return (
    <div className={styles["container"]}>
      <Head>
        <title>Inventory Management</title>
        <meta name="description" content="Generated by create next app"/>
        <link rel="icon" href="/favicon.png"/>
      </Head>

      <main>
        <Link href="/">
          <h1 className={styles["titleLink"]}>Inventory Management</h1>
        </Link>

        <Link href="/shipments/new">
          <a className={styles["createLink"]}>Create shipment</a>
        </Link>
        <Link href="/items/new">
          <a className={styles["createLink"]}>Create item</a>
        </Link>

        <h2>Items</h2>
        <div>
          {
            // List items
            items.map(item => (
              <div key={item.id} className={styles["itemContainer"]}>
                <>
                  <Link href={`/items/edit/${item.id}`}>Edit</Link>
                  {item.name} | Quantity: {item.quantity} |
                  City: {citiesInfoMap.get(item.cityId.toString())?.cityName} {" "}
                  | Current Weather: {citiesInfoMap.get(item.cityId.toString())?.weatherDescription}
                </>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  );
};
