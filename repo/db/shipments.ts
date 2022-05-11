import { client } from "./client";
import { Prisma } from "@prisma/client";
import { BadRequestError, InternalServerError, Item, NotFoundError, Result } from "../../lib/types";

// Inserts a new shipment with the given items into the database and returns the shipment id.
export async function dbInsertShipment(items: Item[]): Promise<Result<number>> {
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
    // Last item in the result list contains the shipment id
    const shipment = result.at(-1);
    if (!shipment?.id) {
      return { ok: false, error: new InternalServerError("Could not retrieve id of newly inserted shipment.") };
    }
    return { ok: true, value: shipment.id };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      return {
        ok: false,
        error: new BadRequestError("At least one of the shipment items have insufficient quantities."),
      };
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { ok: false, error: new NotFoundError("At least one of the shipment items does not exist.") };
    }
    return { ok: false, error: new InternalServerError() };
  }
}
