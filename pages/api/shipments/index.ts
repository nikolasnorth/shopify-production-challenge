import { NextApiRequest, NextApiResponse } from "next";
import { NotFoundError, Shipment } from "../../../lib/types";
import { dbInsertShipment } from "../../../repo/db/shipments";

interface ResponseData {
  shipment?: Pick<Shipment, "id">;
  error?: string;
}

export default async function IndexHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method == "POST") {
    const { items }: Pick<Shipment, "items"> = req.body;
    if (!items || items.length == 0) {
      return res.status(400).json({ error: "At least one shipment item is required." });
    }

    const result = await dbInsertShipment(items);
    if (!result.ok && result.error instanceof NotFoundError) {
      return res.status(404).json({ error: result.error.message });
    }
    if (!result.ok) {
      return res.status(500).end();
    }

    const { value: shipmentId } = result;
    return res.status(201).json({
      shipment: { id: shipmentId },
    });
  }

  return res.status(405).end();
}
