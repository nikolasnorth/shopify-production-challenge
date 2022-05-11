import { config } from "../../lib/config";
import { Item, Shipment } from "../../lib/types";

const BASE_URL = config.BASE_URL;

// Queries API to create a new shipment of the given items. Returns null if the request was unsuccessful.
export async function apiCreateShipment(items: Item[]): Promise<Pick<Shipment, "id"> | null> {
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
  return shipment;
}
