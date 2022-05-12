import { NextApiRequest, NextApiResponse } from "next";
import { HttpError, Item } from "../../../lib/types";
import { dbInsertItem, dbSelectAllItems } from "../../../repo/db/items";
import NextCors from "nextjs-cors";

interface ResponseData {
  item?: Item;
  items?: Item[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  await NextCors(req, res, {
    methods: ["GET", "POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    switch (req.method) {
      case "GET": {
        const items = await dbSelectAllItems();
        return res.status(200).json({ items });
      }
      case "POST": {
        const name: string | undefined = req.body.name;
        const quantity = Number(req.body.quantity);
        const cityId = Number(req.body.cityId);
        if (!name || isNaN(quantity) || isNaN(cityId)) {
          return res.status(400).end("Item name, quantity, and cityId are required.");
        }
        const item = await dbInsertItem({ name, quantity, cityId });
        return res.status(201).json({ item });
      }
      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end("Method not allowed.");
      }
    }
  } catch (e) {
    console.error(e);
    if (e instanceof HttpError) {
      return res.status(e.code).end(e.message);
    }
    return res.status(500).end("Internal server error.");
  }
}
