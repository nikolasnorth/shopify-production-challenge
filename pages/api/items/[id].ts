import {NextApiRequest, NextApiResponse} from "next";
import {Item} from "@lib/types";

interface ResponseData {
  item?: Item;
  error?: string;
}

export default function IdHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const idString = req.query.id;
  if (!idString) {
    return res.status(400).json({
      error: "Item ID is required.",
    });
  }
  const id = Number(idString);

  if (req.method == "GET") {
    const item: Item = {
      id: id,
      name: "iPhone",
      quantity: 10,
    };
    return res.status(200).json({item: item});
  }

  if (req.method == "PUT") {
    const {name, quantity}: Pick<Item, "name" | "quantity"> = req.body;
    if (!name || !quantity) {
      return res.status(400).json({
        error: "At least one of item name or quantity are required.",
      });
    }
    const item: Item = {id: id, name: name, quantity: quantity};
    return res.status(200).json({
      item: item,
    });
  }

  if (req.method == "DELETE") {
    return res.status(204).end();
  }

  return res.status(405).end();
}
