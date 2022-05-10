import {NextApiRequest, NextApiResponse} from "next";
import {Item} from "@lib/types";
import {dbSelectItemWithId, dbUpdateItem} from "@repo/db/items";

interface ResponseData {
  item?: Item;
  error?: string;
}

export default async function ItemIdHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const idString = req.query.id;
  if (!idString) {
    return res.status(400).json({
      error: "Item ID is required.",
    });
  }
  const id = Number(idString);

  if (req.method == "GET") {
    const item = await dbSelectItemWithId(id);
    if (!item) {
      return res.status(404).json({
        error: `Item with 'ID: ${id}' does not exist.`,
      });
    }
    return res.status(200).json({
      item: item,
    });
  }

  if (req.method == "PUT") {
    const {name, quantity}: Partial<Item> = req.body;
    if (!name && !quantity) {
      return res.status(400).json({
        error: "At least one of item name or quantity are required.",
      });
    }
    const item = await dbUpdateItem({id, name, quantity});
    return res.status(200).json({
      item: item,
    });
  }

  if (req.method == "DELETE") {
    return res.status(204).end();
  }

  return res.status(405).end();
}
