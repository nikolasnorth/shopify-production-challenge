import { NextApiRequest, NextApiResponse } from "next";
import { Shipment } from "@lib/types";
import { dbInsertShipment } from "@repo/db/shipments";

interface ResponseData {
  shipment?: Pick<Shipment, "id">;
  error?: string;
}

export default async function IndexHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method == "POST") {
    const { items }: Pick<Shipment, "items"> = req.body;
    if (!items || items.length == 0) {
      return res.status(400).json({
        error: "At least one item is required.",
      });
    }
    const result = await dbInsertShipment(items);
    if (!result) {
      return res.status(500).json({
        error: "Something went wrong.",
      });
    }
    return res.status(201).json({
      shipment: { id: result.id },
    });
  }

  return res.status(405).end();
}
