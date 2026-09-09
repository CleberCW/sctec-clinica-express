export abstract class AppError extends Error {
  public readonly code: number;
  public readonly statusCode: number;

  constructor(
    message: string,
    code: number,
    statusCode: number,
    options?: ErrorOptions,
  ) {
    super(message, options);

    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
