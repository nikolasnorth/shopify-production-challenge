export interface Item {
  id: number;
  name: string;
  quantity: number;
}

export interface Shipment {
  id: number;
  items: Item[];
}

export class HttpError {
  code: number;
  message: string;

  constructor(code: number, message?: string) {
    this.code = code;
    this.message = message || "";
  }
}
