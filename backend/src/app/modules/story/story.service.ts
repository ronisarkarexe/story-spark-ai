import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";

export interface StoryNodeDb {
  query(sql: string, params?: unknown[]): Promise<{ rows: Array<Record<string, unknown>> }>;
  beginTransaction?(): Promise<void>;
  commitTransaction?(): Promise<void>;
  rollbackTransaction?(): Promise<void>;
}

const getChildNodeIds = async (db: StoryNodeDb, parentId: string): Promise<string[]> => {
  const result = await db.query(
    `SELECT id FROM stories WHERE parent_story_id = $1 ORDER BY id ASC`,
    [parentId]
  );

  return (result.rows || []).map((row) => String(row.id));
};

const deleteStoryNode = async (db: StoryNodeDb, nodeId: string): Promise<{ deletedNodeIds: string[] }> => {
  const deletedNodeIds: string[] = [];

  await db.query("BEGIN");

  try {
    const childIds = await getChildNodeIds(db, nodeId);
    for (const childId of childIds) {
      const childResult = await deleteStoryNode(db, childId);
      deletedNodeIds.push(...childResult.deletedNodeIds);
    }

    await db.query(`DELETE FROM stories WHERE id = $1`, [nodeId]);
    deletedNodeIds.push(nodeId);

    await db.query("COMMIT");
    return { deletedNodeIds };
  } catch (error) {
    await db.query("ROLLBACK");

    if (error && typeof error === "object" && "code" in error && (error as { code?: unknown }).code === "23503") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot delete story node because it has dependent child branches."
      );
    }

    throw error;
  }
};

export { deleteStoryNode };
