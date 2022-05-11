import { Item, Shipment } from "@lib/types";

// Queries API to create a new shipment of the given items. Returns null if the request was unsuccessful.
export async function createShipment(items: Item[]): Promise<Shipment | null> {
  const res = await fetch(`${process.env.URL}/api/shipments`, {
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
