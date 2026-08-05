import { describe, it, expect } from "@jest/globals";
import { serializeStoryGraph, IStoryNode } from "../story.serializer";

describe("Story Graph Serializer Cyclic Reference Tests (#5467)", () => {
  it("serializes linear non-cyclic story graph correctly", () => {
    const rootNode: IStoryNode = {
      id: "chap_1",
      title: "Chapter 1: The Beginning",
      content: "Once upon a time...",
      children: [
        {
          id: "chap_2",
          title: "Chapter 2: The Journey",
          content: "Traveling through the forest...",
          children: [],
        },
      ],
    };

    const result = serializeStoryGraph(rootNode);

    expect(result.id).toBe("chap_1");
    expect(result.children).toHaveLength(1);
    expect(result.children[0].id).toBe("chap_2");
    expect(result.children[0].isLoop).toBeUndefined();
  });

  it("handles cyclic narrative loops (Chapter 4 -> Chapter 2) without RangeError stack overflow", () => {
    const chap2: IStoryNode = {
      id: "chap_2",
      title: "Chapter 2: The Crossroads",
      content: "You find two paths...",
      children: [],
    };

    const chap3: IStoryNode = {
      id: "chap_3",
      title: "Chapter 3: The Portal",
      content: "Entering the glowing portal...",
      children: [],
    };

    const chap4: IStoryNode = {
      id: "chap_4",
      title: "Chapter 4: Time Loop",
      content: "The portal sends you back to the crossroads!",
      children: [chap2], // CYCLIC EDGE: Chap 4 loops back to Chap 2
    };

    chap2.children = [chap3];
    chap3.children = [chap4];

    const chap1: IStoryNode = {
      id: "chap_1",
      title: "Chapter 1: Start",
      content: "Beginning...",
      children: [chap2],
    };

    expect(() => {
      const result = serializeStoryGraph(chap1);
      
      // Verify depth 1: Chap 1 -> Chap 2
      expect(result.children[0].id).toBe("chap_2");
      // Verify depth 2: Chap 2 -> Chap 3
      expect(result.children[0].children[0].id).toBe("chap_3");
      // Verify depth 3: Chap 3 -> Chap 4
      expect(result.children[0].children[0].children[0].id).toBe("chap_4");
      // Verify depth 4: Chap 4 -> Chap 2 (LOOP EDGE DETECTED)
      const loopEdge = result.children[0].children[0].children[0].children[0];
      expect(loopEdge.id).toBe("chap_2");
      expect(loopEdge.isLoop).toBe(true);
      expect(loopEdge.targetNodeId).toBe("chap_2");
      expect(loopEdge.children).toHaveLength(0);
    }).not.toThrow();
  });

  it("throws an error for null or invalid story node", () => {
    expect(() => serializeStoryGraph(null as any)).toThrow(/Invalid story node/);
  });
});
