import { Item } from "@lib/types";

// Queries API to retrieve an item with the given id. Returns null if the item does not exist or the request was
// unsuccessful.
export async function getItemById(id: number): Promise<Item | null> {
  const res = await fetch(`${process.env.URL}/api/items/${id}`);
  if (!res.ok) {
    return null;
  }
  const { item } = await res.json();
  return item;
}

// Queries API to retrieve a list of items.
export async function getItems(): Promise<Item[]> {
  const res = await fetch(`${process.env.URL}/api/items`);
  if (!res.ok) {
    return [];
  }
  const { items } = await res.json();
  return items;
}

// Queries API to create a new item. Returns null if request was unsuccessful.
export async function createItem(item: Pick<Item, "name" | "quantity">): Promise<Item | null> {
  const res = await fetch(`${process.env.URL}/api/items`, {
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
export async function editItem(item: Item): Promise<Item | null> {
  const res = await fetch(`${process.env.URL}/api/items/${item.id}`, {
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
export async function deleteItemById(id: number): Promise<boolean> {
  const res = await fetch(`${process.env.URL}/api/items/${id}`, { method: "DELETE" });
  return res.ok;
}
