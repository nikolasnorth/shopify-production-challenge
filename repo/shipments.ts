import {Item, Shipment} from "@lib/types";

// Queries API to create a new shipment of the given items. Returns null if the request was unsuccessful.
export async function createShipment(items: Item[]): Promise<Shipment | null> {
  const min = 1;
  const max = 1000;
  // Random number between [min, max)
  const id = Math.floor(Math.random() * (max - min) + min);
  return {id: id, items: items};
}
