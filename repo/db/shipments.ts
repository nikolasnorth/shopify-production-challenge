import { client } from "./client";
import { Prisma } from "@prisma/client";
import { HttpError, Item } from "../../lib/types";

// Inserts a new shipment with the given items into the database and returns the shipment id.
export async function dbInsertShipment(items: Item[]): Promise<number> {
  try {
    // Create list of item id's
    const itemIds = items.map(item => {
      return { id: item.id };
    });
    // Build a list of queries for the transaction. For each item in shipment items, subtract the quantity of item in
    // the database
    const queries = items.map(item => {
      return client.item.update({
        where: { id: item.id },
        data: { quantity: { decrement: item.quantity } },
      });
    });
    // Build transaction
    const result = await client.$transaction([
      ...queries,
      client.shipment.create({
        data: {
          items: { connect: itemIds },
        },
        select: { id: true },
      }),
    ]);
    return result.at(-1)!.id;  // Last item in the array will be the shipment id
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new HttpError(404, "Item does not exist.");
    }
    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new HttpError(400, "At least one of the items have insufficient quantity.");
    }
    throw e;
  }
}
