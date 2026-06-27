import fs from "fs";
import path from "path";
import ts from "typescript";

const appSource = fs.readFileSync(path.join(__dirname, "../app.ts"), "utf8");
const sourceFile = ts.createSourceFile(
  "app.ts",
  appSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);

const countMiddlewareRegistrations = (middlewareName: string): number => {
  let count = 0;

  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.getText(sourceFile) === "app" &&
      node.expression.name.text === "use"
    ) {
      const middleware = node.arguments[0];

      if (
        middleware &&
        ts.isCallExpression(middleware) &&
        middleware.expression.getText(sourceFile) === middlewareName
      ) {
        count += 1;
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return count;
};

describe("middleware registration", () => {
  it.each(["express.urlencoded", "cookieParser"])(
    "registers %s exactly once",
    (middlewareName) => {
      expect(countMiddlewareRegistrations(middlewareName)).toBe(1);
    }
  );
});
