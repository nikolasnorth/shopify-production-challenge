import {Item} from "@lib/types";

// Queries API to retrieve a list of items.
export async function getItems(): Promise<Item[]> {
  const items: Item[] = Array.of(
    {id: 1, name: "Running shoes", quantity: 10},
    {id: 2, name: "Umbrella", quantity: 7},
    {id: 3, name: "iPhone", quantity: 13},
  );
  return Promise.resolve(items);
}

// Queries API to create a new item. Returns null if request was unsuccessful.
export async function createItem(item: Pick<Item, "name" | "quantity">): Promise<Item | null> {
  const min = 1;
  const max = 1000;
  // Random number between [min, max)
  const id = Math.floor(Math.random() * (max - min) + min);
  return {
    id: id,
    name: item.name,
    quantity: item.quantity,
  };
}
