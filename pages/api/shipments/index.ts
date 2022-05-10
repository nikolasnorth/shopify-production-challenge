import {NextApiRequest, NextApiResponse} from "next";
import {Shipment} from "@lib/types";

interface ResponseData {
  shipment?: Shipment;
  error?: string;
}

export default function IndexHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method == "POST") {
    const {items}: Pick<Shipment, "items"> = req.body;
    if (!items || items.length == 0) {
      return res.status(400).json({
        error: "At least one item is required.",
      });
    }
    const shipment: Shipment = {id: 100, items: items};
    return res.status(201).json({shipment: shipment});
  }

  return res.status(405).end();
}
