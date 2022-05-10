import {NextApiRequest, NextApiResponse} from "next";
import {Item} from "@lib/types";
import {dbInsertItem, dbSelectAllItems} from "@repo/db/items";

interface ResponseData {
  item?: Item;
  items?: Item[];
  error?: string;
}

export default async function ItemIndexHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method == "GET") {
    const items = await dbSelectAllItems();
    return res.status(200).json({
      items: items,
    });
  }

  if (req.method == "POST") {
    const {name, quantity}: Pick<Item, "name" | "quantity"> = req.body;
    if (!name || !quantity) {
      return res.status(400).json({
        error: "Item name and quantity are required.",
      });
    }
    const item = await dbInsertItem({name, quantity});
    return res.status(201).json({
      item: item,
    });
  }

  return res.status(405).end();
}
