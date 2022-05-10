import {NextApiRequest, NextApiResponse} from "next";
import {Item} from "@lib/types";

interface ResponseData {
  item?: Item;
  items?: Item[];
  error?: string;
}

export default function IndexHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method == "GET") {
    const items = Array.of(
      {id: 1, name: "Running shoes", quantity: 10},
      {id: 2, name: "Umbrella", quantity: 7},
      {id: 3, name: "iPhone", quantity: 13},
    );
    return res.status(200).json({items: items});
  }

  if (req.method == "POST") {
    const {name, quantity}: Pick<Item, "name" | "quantity"> = req.body;
    if (!name || !quantity) {
      return res.status(400).json({
        error: "Item name and quantity are required.",
      });
    }
    // Random number between [min, max)
    const min = 1, max = 1000;
    const id = Math.floor(Math.random() * (max - min) + min);
    const item = {
      id: id,
      name: name,
      quantity: quantity,
    };
    return res.status(201).json({
      item: item,
    });
  }

  return res.status(405).end();
}
