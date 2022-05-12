import { client } from "./client";
import { HttpError, Item } from "../../lib/types";
import { Prisma } from "@prisma/client";

// Selects all items from the database.
export async function dbSelectAllItems(): Promise<Item[]> {
  return await client.item.findMany();
}

// Selects an item with the given id from the database.
export async function dbSelectItemWithId(id: number): Promise<Item> {
  const item = await client.item.findUnique({ where: { id: id } });
  if (!item) {
    throw new HttpError(404, "Item does not exist.");
  }
  return item;
}

// Inserts the given item into the database.
export async function dbInsertItem(item: Pick<Item, "name" | "quantity">): Promise<Item> {
  return await client.item.create({ data: item });
}

// Updates the given item in the database.
export async function dbUpdateItem({ id, name, quantity }: { id: number, name?: string, quantity?: number })
  : Promise<Item> {
  try {
    return await client.item.update({
      where: { id: id },
      data: { name, quantity },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new HttpError(404, "Item does not exist.");
    }
    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new HttpError(400, "Quantity cannot be negative.");
    }
    throw e;
  }
}

// Deletes the item with the given id from the database.
export async function dbDeleteItemWithId(id: number): Promise<void> {
  try {
    await client.item.delete({ where: { id: id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new HttpError(404, "Item does not exist.");
    }
    throw e;
  }
}
