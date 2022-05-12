import { NextApiRequest, NextApiResponse } from "next";
import { HttpError, Item } from "../../../lib/types";
import { dbDeleteItemWithId, dbSelectItemWithId, dbUpdateItem } from "../../../repo/db/items";

interface ResponseData {
  item?: Item;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const id = Number(req.query["id"]);
    if (isNaN(id)) {
      return res.status(400).end("Id must be a valid number");
    }
    switch (req.method) {
      case "GET": {
        const item = await dbSelectItemWithId(id);
        return res.status(200).json({ item: item });
      }
      case "PUT": {
        const name: string | undefined = req.body.name;
        const quantity = Number(req.body.quantity);
        if (isNaN(quantity) || quantity < 0) {
          return res.status(400).end("Quantity must be a valid non-negative number");
        }
        const item = await dbUpdateItem({ id, name, quantity });
        return res.status(200).json({ item });
      }
      case "DELETE": {
        await dbDeleteItemWithId(id);
        return res.status(204).end("Item deleted.");
      }
      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end("Method not allowed");
      }
    }
  } catch (e) {
    if (e instanceof HttpError) {
      return res.status(e.code).end(e.message);
    } else {
      return res.status(500).end("Internal server error.");
    }
  }
}
