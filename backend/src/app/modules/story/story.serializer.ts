export interface IStoryNode {
  id: string;
  title: string;
  content: string;
  choices?: { text: string; nextNodeId: string }[];
  children?: IStoryNode[];
}

export interface SerializedStoryNode {
  id: string;
  title: string;
  content: string;
  isLoop?: boolean;
  targetNodeId?: string;
  choices?: { text: string; nextNodeId: string }[];
  children: SerializedStoryNode[];
}

/**
 * Story Graph Serializer
 * Recursively serializes interactive branching story nodes into graph JSON objects.
 * Prevents stack overflow RangeError crashes when cyclic narrative loops exist (e.g. Chapter 4 -> Chapter 2)
 * by tracking visited node IDs using Set<string>.
 */
export function serializeStoryGraph(
  node: IStoryNode,
  visited: Set<string> = new Set()
): SerializedStoryNode {
  if (!node || !node.id) {
    throw new Error('Invalid story node specified');
  }

  // 1. Detect cyclic reference edges to prevent RangeError stack overflow crashes
  if (visited.has(node.id)) {
    return {
      id: node.id,
      title: node.title || 'Loop Edge',
      content: node.content || '',
      isLoop: true,
      targetNodeId: node.id,
      choices: [],
      children: [],
    };
  }

  // 2. Track visited node ID in set
  const nextVisited = new Set(visited);
  nextVisited.add(node.id);

  // 3. Serialize children nodes safely
  const children: SerializedStoryNode[] = [];
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      children.push(serializeStoryGraph(child, nextVisited));
    }
  }

  return {
    id: node.id,
    title: node.title || '',
    content: node.content || '',
    choices: node.choices || [],
    children,
  };
}

export default serializeStoryGraph;
