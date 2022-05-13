import { NextApiRequest, NextApiResponse } from "next";
import { HttpError, Item, Shipment } from "../../../../lib/types";
import { dbInsertShipment } from "../../../../repo/db/shipments";
import NextCors from "nextjs-cors";

interface ResponseData {
  shipment?: Pick<Shipment, "id">;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  await NextCors(req, res, {
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    switch (req.method) {
      case "POST": {
        const items: Item[] | undefined = req.body.items;
        if (!items || items.length == 0) {
          return res.status(400).end("At least one shipment item is required.");
        }
        const shipmentId = await dbInsertShipment(items);
        return res.status(201).json({ shipment: { id: shipmentId } });
      }
      default: {
        res.setHeader("Allow", ["POST"]);
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
