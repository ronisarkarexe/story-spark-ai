export function getErrorMessage(err: unknown): string {
  if (typeof err !== "object" || err === null) {
    return "Something went wrong";
  }

  // Handle explicit status codes for API responses
  if ("status" in err) {
    const status = (err as Record<string, unknown>).status;
    if (status === 413 || status === "413") {
      return "The prompt is too large. Please shorten your prompt to 1000 characters or fewer.";
    }
    if (status === 400 || status === "400") {
      return "Invalid request. Please check your prompt and try again.";
    }
  }

  // Check if it is a standard response error containing data object
  if ("data" in err && err.data && typeof err.data === "object") {
    const data = err.data as Record<string, unknown>;
    
    // Check for data.message
    if (typeof data.message === "string") {
      return data.message;
    }

    // Check for data.error
    if (typeof data.error === "string") {
      return data.error;
    }

    // Check for array of messages (original check)
    if (Array.isArray(data.data)) {
      const errorArray = data.data as { message?: string }[];
      if (errorArray.length > 0 && errorArray[0]?.message) {
        return errorArray[0].message;
      }
    }
    
    if (Array.isArray(data)) {
      const errorArray = data as { message?: string }[];
      if (errorArray.length > 0 && errorArray[0]?.message) {
        return errorArray[0].message;
      }
    }
  }

  // Check if message is directly on err
  if ("message" in err && typeof err.message === "string") {
    return err.message;
  }

  // Check if error is directly on err
  if ("error" in err && typeof err.error === "string") {
    return err.error;
  }

  return "Something went wrong";
}
