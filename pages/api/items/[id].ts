import { NextApiRequest, NextApiResponse } from "next";
import { Item, NotFoundError } from "../../../lib/types";
import { dbDeleteItemWithId, dbSelectItemWithId, dbUpdateItem } from "../../../repo/db/items";

interface ResponseData {
  item?: Item;
  error?: string;
}

export default async function ItemIdHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const idString = req.query.id;
  if (!idString) {
    return res.status(400).json({ error: "Item id is required." });
  }
  const id = Number(idString);

  if (req.method == "GET") {
    const result = await dbSelectItemWithId(id);
    if (!result.ok) {
      return res.status(404).json({ error: result.error.message });
    }

    const { value: item } = result;
    return res.status(200).json({ item });
  }

  if (req.method == "PUT") {
    const { name, quantity }: Partial<Item> = req.body;
    if (!name && !quantity) {
      return res.status(400).json({ error: "At least one of item name or quantity are required." });
    }

    const result = await dbUpdateItem({ id, name, quantity });
    if (!result.ok && result.error instanceof NotFoundError) {
      return res.status(404).json({ error: result.error.message });
    }
    if (!result.ok) {
      return res.status(500).end();
    }

    const { value: item } = result;
    return res.status(200).json({ item });
  }

  if (req.method == "DELETE") {
    const result = await dbDeleteItemWithId(id);
    if (!result.ok && result.error instanceof NotFoundError) {
      return res.status(404).json({ error: result.error.message });
    }
    if (!result.ok) {
      return res.status(500).end();
    }

    return res.status(204).end();
  }

  return res.status(405).end();
}
