import { config } from "../../lib/config";
import { HttpRequestFail, Item, Result, Shipment } from "../../lib/types";

const BASE_URL = process.env.NODE_ENV == "production" ? config.PROD_BASE_URL : config.DEV_BASE_URL;

// Queries API to create a new shipment of the given items. Returns null if the request was unsuccessful.
export async function apiCreateShipment(items: Item[]): Promise<Result<number>> {
  const res = await fetch(`${BASE_URL}/api/shipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: items }),
  });
  if (!res.ok) {
    const { error }: { error?: string } = await res.json();
    if (error) {
      return {
        ok: false,
        error: new HttpRequestFail(`Could not request API to create a new shipment. Error: ${error}`),
      };
    }
    return { ok: false, error: new HttpRequestFail("Could not request API to create a new shipment.") };
  }

  const { shipment }: { shipment?: Pick<Shipment, "id"> } = await res.json();
  if (!shipment?.id) {
    return {
      ok: false,
      error: new HttpRequestFail("Successfully created a new shipment, however response did not include the id."),
    };
  }

  return { ok: true, value: shipment.id };
}
