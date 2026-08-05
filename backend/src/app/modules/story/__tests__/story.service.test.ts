import { deleteStoryNode } from "../story.service";
import ApiError from "../../../../errors/api_error";

describe("StoryService.deleteStoryNode", () => {
  const makeDb = (options: { childIdsByNode?: Record<string, string[]>; deleteError?: Error | { code: string; message: string } }) => {
    const childIdsByNode = options.childIdsByNode ?? {};
    const deletedNodeIds: string[] = [];
    const query = jest.fn(async (sql: string, params?: unknown[]) => {
      if (sql === "BEGIN" || sql === "COMMIT" || sql === "ROLLBACK") {
        return { rows: [] };
      }

      if (sql.includes("SELECT id FROM stories")) {
        const parentId = String(params?.[0] ?? "");
        return { rows: (childIdsByNode[parentId] ?? []).map((id) => ({ id })) };
      }

      if (sql.includes("DELETE FROM stories")) {
        const nodeId = String(params?.[0] ?? "");
        deletedNodeIds.push(nodeId);
        if (options.deleteError) {
          throw options.deleteError;
        }
        return { rows: [] };
      }

      return { rows: [] };
    });

    return { query, deletedNodeIds };
  };

  it("deletes a parent node together with its child branches", async () => {
    const db = makeDb({ childIdsByNode: { "parent-1": ["child-1"] } });

    const result = await deleteStoryNode(db as any, "parent-1");

    expect(result.deletedNodeIds).toEqual(["child-1", "parent-1"]);
  });

  it("deletes a subtree in cascade order", async () => {
    const db = makeDb({ childIdsByNode: { "parent-1": ["child-1"], "child-1": ["grandchild-1"] } });

    const result = await deleteStoryNode(db as any, "parent-1");

    expect(result.deletedNodeIds).toEqual(["grandchild-1", "child-1", "parent-1"]);
  });

  it("rolls back the transaction when deletion fails", async () => {
    const db = makeDb({ deleteError: new Error("boom") });

    await expect(deleteStoryNode(db as any, "parent-1")).rejects.toThrow("boom");
    expect(db.query).toHaveBeenCalledWith("ROLLBACK");
  });

  it("returns a 400 error for foreign key constraint failures", async () => {
    const db = makeDb({ deleteError: { code: "23503", message: "foreign key constraint" } });

    await expect(deleteStoryNode(db as any, "parent-1")).rejects.toBeInstanceOf(ApiError);
    await expect(deleteStoryNode(db as any, "parent-1")).rejects.toMatchObject({
      statusCode: 400,
      message: "Cannot delete story node because it has dependent child branches.",
    });
  });
});
