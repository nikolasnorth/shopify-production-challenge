import { config } from "../../lib/config";
import { HttpError, Item, Shipment } from "../../lib/types";

const BASE_URL = process.env.NODE_ENV == "production" ? config.PROD_BASE_URL : config.DEV_BASE_URL;

// Queries API to create a new shipment of the given items. Returns null if the request was unsuccessful.
export async function apiCreateShipment(items: Item[]): Promise<number> {
  const res = await fetch(`${BASE_URL}/shipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: items }),
  });
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new HttpError(res.status, errorMessage || "HTTP request failed to create shipment.");
  }
  const { shipment }: { shipment?: Shipment } = await res.json();
  if (!shipment?.id) {
    throw new Error("Expected response to contain shipment ID.");
  }
  return shipment.id;
}
