# 🌿 Story Branching Visualizer (Lineage Tree for AI Variations)

This feature enables users to view and interact with the complete lineage history of stories, remixes, translations, and refinements in an interactive, animated React Flow tree diagram.

---

## 1. Database Model Changes

The Mongoose `Post` schema has been updated to include story lineage tracking.

### Schema Fields
Added the following fields to `PostSchema` in [post.model.ts](file:///c:/Users/HP/Downloads/story_spark/story-spark-ai/backend/src/app/modules/post/post.model.ts) and the `IPost` interface in [post.interface.ts](file:///c:/Users/HP/Downloads/story_spark/story-spark-ai/backend/src/app/modules/post/post.interface.ts):

```typescript
parentStoryId?: ObjectId | null; // The direct parent story from which this story was derived
rootStoryId?: ObjectId;          // The absolute root story of this entire lineage tree
branchDepth?: number;            // Depth level of the story in the lineage tree (root is 0)
```

### Lineage Rules
- **Root Story** (created from a fresh prompt):
  - `parentStoryId` = `null`
  - `rootStoryId` = `own _id`
  - `branchDepth` = `0`
- **Derived Story** (generated as a translation, continuation, or remix):
  - `parentStoryId` = `source story _id`
  - `rootStoryId` = `source.rootStoryId`
  - `branchDepth` = `source.branchDepth + 1`

### Indexes
Indexes are created on `parentStoryId` and `rootStoryId` to ensure rapid subtree retrievals.

---

## 2. API Endpoints

### Get Story Lineage Tree
Retrieves all stories belonging to a lineage tree hierarchy and formats them.

* **URL:** `/api/stories/:rootStoryId/tree`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response:**
  * **Code:** 200 OK
  * **Content:**
    ```json
    {
      "rootStoryId": "64b1f486a2f3b90012abc123",
      "nodes": [
        {
          "id": "64b1f486a2f3b90012abc123",
          "title": "The Quest of the Lost Star",
          "parentStoryId": null,
          "branchDepth": 0,
          "createdAt": "2026-06-20T12:00:00.000Z",
          "author": "64b1e5a5a2f3b90012abc000",
          "status": "published"
        },
        {
          "id": "64b1f4caa2f3b90012abc456",
          "title": "Remix: The Quest of the Lost Star (Sci-Fi Setting)",
          "parentStoryId": "64b1f486a2f3b90012abc123",
          "branchDepth": 1,
          "createdAt": "2026-06-20T12:15:00.000Z",
          "author": "64b1e5a5a2f3b90012abc000",
          "status": "published"
        }
      ]
    }
    ```

---

## 3. Frontend Visualization & React Flow

The interactive visualizer is implemented in the frontend workspace using `reactflow`.

### Directory Structure
Located under [components/story-tree](file:///c:/Users/HP/Downloads/story_spark/story-spark-ai/frontend/src/components/story-tree/):
- `StoryTreeView.tsx`: Handles React Flow canvas, node state, search filtering, depth filters, collapse/expand interactions, and centering.
- `StoryTreeNode.tsx`: Custom React Flow node design displaying metadata badges ("🌱 Root" / "🌿 Branch"), depth numbers, story title, and active highlighted states.
- `treeUtils.ts`: Bottom-up layout positioning algorithm resolving node coordinates to prevent overlaps.

### Key Visual Features
1. **Interactive Controls:** MiniMap, Zoom/Pan controls, custom node clicks targeting the reader/editor interface.
2. **Search Highlight:** Search by title to instantly highlight relevant nodes.
3. **Branch Filtering:** Sliders or dropdowns to filter visible branches by depth.
4. **Collapsible Subtrees:** Click to collapse or expand children of a specific node.
