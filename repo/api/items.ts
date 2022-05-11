import { Item } from "../../lib/types";
import { config } from "../../lib/config";

const BASE_URL = config.BASE_URL;

// Queries API to retrieve an item with the given id. Returns null if the item does not exist or the request was
// unsuccessful.
export async function apiGetItemById(id: number): Promise<Item | null> {
  const res = await fetch(`${BASE_URL}/api/items/${id}`);
  if (!res.ok) {
    return null;
  }
  const { item } = await res.json();
  return item;
}

// Queries API to retrieve a list of items.
export async function apiGetItems(): Promise<Item[]> {
  const res = await fetch(`${BASE_URL}/api/items`);
  if (!res.ok) {
    return [];
  }
  const { items } = await res.json();
  return items;
}

// Queries API to create a new item. Returns null if request was unsuccessful.
export async function apiCreateItem(item: Pick<Item, "name" | "quantity">): Promise<Item | null> {
  const res = await fetch(`${BASE_URL}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    return null;
  }
  const { item: createdItem } = await res.json();
  return createdItem;
}

// Queries API to edit the given item. Returns null if the request was unsuccessful.
export async function apiEditItem(item: Item): Promise<Item | null> {
  const res = await fetch(`${BASE_URL}/api/items/${item.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    return null;
  }
  const { item: updatedItem } = await res.json();
  return updatedItem;
}

// Queries API to delete the item with the given id. Returns true if the item was successfully deleted, otherwise
// returns false.
export async function apiDeleteItemById(id: number): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/items/${id}`, { method: "DELETE" });
  return res.ok;
}
