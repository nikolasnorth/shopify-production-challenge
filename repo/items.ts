import {Item} from "@lib/types";

// Queries API to retrieve a list of items.
export function getItems(): Promise<Item[]> {
  const items: Item[] = Array.of(
    {id: 1, name: "Running shoes", quantity: 10},
    {id: 2, name: "Umbrella", quantity: 7},
    {id: 1, name: "iPhone", quantity: 13},
  );
  return Promise.resolve(items);
}
