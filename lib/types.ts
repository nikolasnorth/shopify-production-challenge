// Database Model Types
export interface Item {
  id: number;
  name: string;
  quantity: number;
}

export interface Shipment {
  id: number;
  items: Item[];
}

// Custom Error Types
interface CustomError {
  message: string;
}

export class NotFoundError implements CustomError {
  message: string;

  constructor(message?: string) {
    this.message = message || "Item not found.";
  }
}

export class BadRequestError implements CustomError {
  message: string;

  constructor(message?: string) {
    this.message = message || "Bad request.";
  }
}

export class InternalServerError implements CustomError {
  message: string;

  constructor(message?: string) {
    this.message = message || "Internal server error.";
  }
}

type Ok<T> = {
  ok: true;
  value: T;
}

type Err = {
  ok: false;
  error: CustomError;
}

export type Result<T> = Ok<T> | Err;
