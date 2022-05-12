import { HttpError, Item } from "../../lib/types";
import { config } from "../../lib/config";

const BASE_URL = process.env.NODE_ENV == "production" ? config.PROD_BASE_URL : config.DEV_BASE_URL;

// Queries API to retrieve an item with the given id.
export async function apiGetItemById(id: number): Promise<Item> {
  const res = await fetch(`${BASE_URL}/api/items/${id}`);
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new HttpError(res.status, errorMessage || "HTTP request failed to get item by ID.");
  }
  const { item }: { item?: Item } = await res.json();
  if (!item) {
    throw new Error("Successfully requested an item by ID, however did not receive an item in response.");
  }
  return item;
}

// Queries API to retrieve a list of items.
export async function apiGetItems(): Promise<Item[]> {
  const res = await fetch(`${BASE_URL}/api/items`);
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new HttpError(res.status, errorMessage || "HTTP request failed to get all items.");
  }
  const { items }: { items: Item[] } = await res.json();
  return items;
}

// Queries API to create a new item.
export async function apiCreateItem(item: Pick<Item, "name" | "quantity">): Promise<Item> {
  const res = await fetch(`${BASE_URL}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new HttpError(res.status, errorMessage || "HTTP request failed to create an item.");
  }
  const { item: createdItem }: { item?: Item } = await res.json();
  if (!createdItem) {
    throw new Error("Successfully created an item, however expected response to include newly created item.");
  }
  return createdItem;
}

// Queries API to edit the given item.
export async function apiEditItem(item: Item): Promise<Item> {
  const res = await fetch(`${BASE_URL}/api/items/${item.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new HttpError(res.status, errorMessage || "HTTP request failed to edit item by ID.");
  }
  const { item: updatedItem }: { item?: Item } = await res.json();
  if (!updatedItem) {
    throw new Error("Successfully edited item, however expected response to include newly edited item.");
  }
  return updatedItem;
}

// Queries API to delete the item with the given id. Returns true if the item was successfully deleted, otherwise
// returns false.
export async function apiDeleteItemById(id: number): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/items/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new HttpError(res.status, errorMessage || "HTTP request failed to delete item by ID.");
  }
  return true;
}
