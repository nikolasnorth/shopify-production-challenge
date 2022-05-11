import { client } from "./client";
import { Prisma } from "@prisma/client";
import { Item, Shipment } from "../../lib/types";

// Inserts a new shipment with the given items into the database. Returns null if the operation was unsuccessful.
export async function dbInsertShipment(items: Item[]): Promise<Pick<Shipment, "id"> | undefined> {
  try {
    const itemIds = items.map(item => {
      return { id: item.id };
    });
    // For each item in shipment items, subtract the quantity of item from the database.
    const queries = items.map(item => {
      return client.item.update({
        where: { id: item.id },
        data: { quantity: { decrement: item.quantity } },
      });
    });
    const result = await client.$transaction([
      ...queries,
      client.shipment.create({
        data: {
          items: { connect: itemIds },
        },
        select: {
          // Only return the ID of the newly inserted shipment
          id: true,
        },
      }),
    ]);
    // Last item in the result list contains the shipment ID.
    return result.at(-1);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      // Quantity CHECK constraint failed.
    }
    return undefined;
  }
}
