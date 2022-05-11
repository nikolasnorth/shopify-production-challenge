import { client } from "./client";
import { InternalServerError, Item, NotFoundError, Result } from "../../lib/types";
import { Prisma } from "@prisma/client";

// Selects all items from the database.
export async function dbSelectAllItems(): Promise<Item[]> {
  return await client.item.findMany();
}

// Selects an item with the given id from the database.
export async function dbSelectItemWithId(id: number): Promise<Result<Item>> {
  const item = await client.item.findUnique({
    where: { id: id },
  });
  if (!item) {
    return { ok: false, error: new NotFoundError() };
  }
  return { ok: true, value: item };
}

// Inserts the given item into the database.
export async function dbInsertItem(item: Pick<Item, "name" | "quantity">): Promise<Item> {
  return await client.item.create({ data: item });
}

// Updates the given item in the database.
export async function dbUpdateItem(item: Partial<Item>): Promise<Result<Item>> {
  try {
    const { id, name, quantity } = item;
    const updatedItem = await client.item.update({
      where: { id: id },
      data: { name, quantity },
    });
    return { ok: true, value: updatedItem };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { ok: false, error: new NotFoundError() };
    } else {
      return { ok: false, error: new InternalServerError() };
    }
  }
}

// Deletes the item with the given id from the database.
export async function dbDeleteItemWithId(id: number): Promise<Result<unknown>> {
  try {
    await client.item.delete({
      where: { id: id },
    });
    return { ok: true, value: 0 };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { ok: false, error: new NotFoundError() };
    }
    return { ok: false, error: new InternalServerError() };
  }
}
