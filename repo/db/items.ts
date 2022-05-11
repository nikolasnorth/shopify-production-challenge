import { client } from "./client";
import { Item } from "../../lib/types";

// Selects all items from the database.
export async function dbSelectAllItems(): Promise<Item[]> {
  return await client.item.findMany();
}

// Selects an item with the given id from the database.
export async function dbSelectItemWithId(id: number): Promise<Item | null> {
  return await client.item.findUnique({
    where: { id: id },
  });
}

// Inserts the given item into the database.
export async function dbInsertItem(item: Pick<Item, "name" | "quantity">): Promise<Item> {
  return await client.item.create({ data: item });
}

// Updates the given item in the database.
export async function dbUpdateItem(item: Partial<Item>): Promise<Item> {
  const { id, name, quantity } = item;
  return client.item.update({
    where: { id: id },
    data: { name, quantity },
  });
}

// Deletes the item with the given id from the database. Returns true if item was successfully deleted, otherwise false.
export async function dbDeleteItemWithId(id: number): Promise<boolean> {
  try {
    await client.item.delete({
      where: { id: id },
    });
    return true;
  } catch (e) {
    return false;
  }
}
