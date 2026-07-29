export type HttpErrorType = "Not Found" | "Conflict" | "Forbidden" | "Bad Request" | "Internal Error";

class AppError extends Error {
  errorType: HttpErrorType;
  #statusCode: number;
  constructor(error_type: HttpErrorType, message: string) {
    super(message);
    this.errorType = error_type;
    this.#statusCode = this.getStatusCode();
  }

  get statusCode() {
    return this.#statusCode
  }

  getStatusCode() {
    switch (this.errorType) {
      case "Bad Request":
        return 400;
      case "Not Found":
        return 404;
      case "Forbidden":
        return 403;
      case "Conflict":
        return 409;
      case "Internal Error":
        return 500;
    }
  }

    static notFound(message: string) {
    return new AppError("Not Found", message);
  }

  static forbidden(message: string) {
    return new AppError("Forbidden", message);
  }

  static badRequest(message: string) {
    return new AppError("Bad Request", message);
  }

  static conflict(message: string) {
    return new AppError("Conflict", message);
  }

  static internalError(message: string) {
    return new AppError("Internal Error", message);
  }
}

export { AppError }