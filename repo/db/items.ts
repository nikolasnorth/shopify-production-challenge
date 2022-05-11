import { prisma } from "@repo/db/clientSingleton";
import { Item } from "@lib/types";

// Selects all items from the database.
export async function dbSelectAllItems(): Promise<Item[]> {
  return await prisma.item.findMany();
}

// Selects an item with the given id from the database.
export async function dbSelectItemWithId(id: number): Promise<Item | null> {
  return await prisma.item.findUnique({
    where: { id: id },
  });
}

// Inserts the given item into the database.
export async function dbInsertItem(item: Pick<Item, "name" | "quantity">): Promise<Item> {
  return await prisma.item.create({ data: item });
}

// Updates the given item in the database.
export async function dbUpdateItem(item: Partial<Item>): Promise<Item> {
  const { id, name, quantity } = item;
  return prisma.item.update({
    where: { id: id },
    data: { name, quantity },
  });
}
