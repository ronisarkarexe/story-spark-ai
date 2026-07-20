import httpLogger from "../http.logger";

// httpLogger is a morgan middleware configured with:
// format: ":id :method :url :status :response-time ms - :res[content-length]"
// stream: writes to the shared logger utility

describe("httpLogger middleware", () => {
  it("exports a function", () => {
    expect(typeof httpLogger).toBe("function");
  });

  it("is a valid express request handler", () => {
    // morgan returns a function with arity 3 (req, res, next)
    expect(httpLogger.length).toBe(3);
  });
});
