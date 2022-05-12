export interface Item {
  id: number;
  name: string;
  quantity: number;
  city?: City;
}

export interface Shipment {
  id: number;
  items: Item[];
}

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  openWeatherId: number;
  items?: Item[];
}

export class HttpError {
  code: number;
  message: string;

  constructor(code: number, message?: string) {
    this.code = code;
    this.message = message || "";
  }
}
