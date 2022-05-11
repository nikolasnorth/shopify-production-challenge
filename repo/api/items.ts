import { HttpRequestFail, Item, Result } from "../../lib/types";
import { config } from "../../lib/config";

const BASE_URL = process.env.NODE_ENV == "production" ? config.PROD_BASE_URL : config.DEV_BASE_URL;

// Queries API to retrieve an item with the given id.
export async function apiGetItemById(id: number): Promise<Result<Item>> {
  const res = await fetch(`${BASE_URL}/api/items/${id}`);
  if (!res.ok) {
    const { error }: { error?: string } = await res.json();
    if (error) {
      return { ok: false, error: new HttpRequestFail(error) };
    }
    return { ok: false, error: new HttpRequestFail("Could not fetch item by id.") };
  }

  const { item }: { item: Item } = await res.json();
  return { ok: true, value: item };
}

// Queries API to retrieve a list of items.
export async function apiGetItems(): Promise<Result<Item[]>> {
  const res = await fetch(`${BASE_URL}/api/items`);
  if (!res.ok) {
    return { ok: false, error: new HttpRequestFail("Could not fetch all items from API.") };
  }
  const { items }: { items: Item[] } = await res.json();
  return { ok: true, value: items };
}

// Queries API to create a new item.
export async function apiCreateItem(item: Pick<Item, "name" | "quantity">): Promise<Result<Item>> {
  const res = await fetch(`${BASE_URL}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const { error }: { error?: string } = await res.json();
    if (error) {
      return { ok: false, error: new HttpRequestFail(error) };
    }
    return { ok: false, error: new HttpRequestFail("Failed to create item.") };
  }

  const { item: createdItem } = await res.json();
  return createdItem;
}

// Queries API to edit the given item.
export async function apiEditItem(item: Item): Promise<Result<Item>> {
  const res = await fetch(`${BASE_URL}/api/items/${item.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const { error }: { error?: string } = await res.json();
    if (error) {
      return { ok: false, error: new HttpRequestFail(error) };
    }
    return { ok: false, error: new HttpRequestFail("Failed to edit item.") };
  }

  const { item: updatedItem }: { item: Item } = await res.json();
  return { ok: true, value: updatedItem };
}

// Queries API to delete the item with the given id. Returns true if the item was successfully deleted, otherwise
// returns false.
export async function apiDeleteItemById(id: number): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/items/${id}`, { method: "DELETE" });
  return res.ok;
}
