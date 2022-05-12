/// Database Model Types

// Represents an inventory item.
export interface Item {
  id: number;
  name: string;
  quantity: number;
}

// Represents a shipment of inventory items.
export interface Shipment {
  id: number;
  items: Item[];
}

/// Other Types

export class HttpError {
  code: number;
  message: string;

  constructor(code: number, message?: string) {
    this.code = code;
    this.message = message || "";
  }
}

// Base interface for custom error types below.
export interface CustomError {
  message: string;
}

export class NotFoundError implements CustomError {
  message: string;

  constructor(message?: string) {
    this.message = message || "Not found.";
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

export class HttpRequestFail implements CustomError {
  message: string;

  constructor(message?: string) {
    this.message = message || "HTTP request fail.";
  }
}

// Wrapper type for a successful value.
type Ok<T> = {
  ok: true;
  value: T;
}

// Wrapper type for an error.
type Err = {
  ok: false;
  error: CustomError;
}

// Result describes two possibilities: a successful value or an error.
export type Result<T> = Ok<T> | Err;
