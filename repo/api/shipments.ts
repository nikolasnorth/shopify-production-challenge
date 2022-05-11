import { config } from "../../lib/config";
import { Item } from "../../lib/types";

const BASE_URL = process.env.NODE_ENV == "production" ? config.PROD_BASE_URL : config.DEV_BASE_URL;

// Queries API to create a new shipment of the given items. Returns null if the request was unsuccessful.
export async function apiCreateShipment(items: Item[]): Promise<number | null> {
  const res = await fetch(`${BASE_URL}/api/shipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: items }),
  });
  if (!res.ok) {
    return null;
  }
  const { shipment } = await res.json();
  if (!shipment?.id) {
    return null;
  }
  return shipment.id;
}
