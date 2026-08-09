/**
 * Regression test for issue #2274 — duplicate middleware registration in app.ts.
 *
 * body-parsing (json, urlencoded), cookieParser, and sanitizeAllMiddleware
 * were each registered more than once, so every request ran them multiple
 * times. This test asserts each is registered exactly once by inspecting the
 * real Express application's router stack.
 */
import app from "../app";

type Layer = { name?: string; handle?: { name?: string } };

const stack: Layer[] = (app as unknown as { _router: { stack: Layer[] } })._router.stack;

const countNamed = (predicate: (layer: Layer) => boolean): number =>
  stack.filter(predicate).length;

describe("app middleware registration (issue #2274)", () => {
  it("registers express.json exactly once", () => {
    const n = countNamed((l) => l.name === "jsonParser");
    expect(n).toBe(1);
  });

  it("registers express.urlencoded exactly once", () => {
    const n = countNamed((l) => l.name === "urlencodedParser");
    expect(n).toBe(1);
  });

  it("registers cookieParser exactly once", () => {
    const n = countNamed((l) => l.name === "cookieParser");
    expect(n).toBe(1);
  });

  it("registers sanitizeAllMiddleware exactly once", () => {
    // sanitizeAllMiddleware is an array of [sanitizeQueryMiddleware, sanitizeBodyMiddleware];
    // Express flattens app.use(array) so each inner middleware appears once.
    const queries = countNamed((l) => l.name === "sanitizeQueryMiddleware");
    const bodies = countNamed((l) => l.name === "sanitizeBodyMiddleware");
    expect(queries).toBe(1);
    expect(bodies).toBe(1);
  });
});
