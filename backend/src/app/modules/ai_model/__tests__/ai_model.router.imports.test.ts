import path from "path";
import ts from "typescript";

const routerPath = path.resolve(__dirname, "../ai_model.router.ts");

const middlewareImports = [
  "../../middleware/validate.request",
  "../../middleware/check.request.limit",
  "../../middleware/auth.middleware",
  "../../middleware/free-ai.rate-limiter",
  "../../middleware/ip.rate-limiter",
];

describe("AI model router middleware imports", () => {
  it("resolves middleware modules from the router location", () => {
    for (const importPath of middlewareImports) {
      const resolved = ts.resolveModuleName(
        importPath,
        routerPath,
        {
          moduleResolution: ts.ModuleResolutionKind.Node10,
        },
        ts.sys
      ).resolvedModule;

      expect(resolved?.resolvedFileName).toContain(
        path.normalize("backend/src/app/middleware/")
      );
    }
  });
});
