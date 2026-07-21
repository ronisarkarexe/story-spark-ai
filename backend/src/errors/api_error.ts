class ApiError extends Error {
  statusCode: number;
  headers?: Record<string, string>;
  constructor(statusCode: number, message: string | undefined, stack = "", headers?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.headers = headers;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
