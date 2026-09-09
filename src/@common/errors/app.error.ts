export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number, options?: ErrorOptions) {
    super(message, options);

    this.name = new.target.name;
    this.statusCode = statusCode;
  }
}
