export interface StoryChoice {
  id: string;
  text: string;
  nextNodeId: string;
}

export interface StoryNode {
  id: string;
  title: string;
  content: string;
  choices: StoryChoice[];
}

// Create a new story node
export const createNode = (
  id: string,
  title: string,
  content: string,
  choices: StoryChoice[] = []
): StoryNode => {
  return {
    id,
    title,
    content,
    choices,
  };
};

// Add a choice to a node
export const addChoice = (node: StoryNode, choice: StoryChoice): StoryNode => {
  return {
    ...node,
    choices: [...node.choices, choice],
  };
};

// Remove a choice from a node
export const removeChoice = (node: StoryNode, choiceId: string): StoryNode => {
  return {
    ...node,
    choices: node.choices.filter((choice) => choice.id !== choiceId),
  };
};

// Update a choice in a node
export const updateChoice = (
  node: StoryNode,
  choiceId: string,
  updatedChoice: Partial<StoryChoice>
): StoryNode => {
  return {
    ...node,
    choices: node.choices.map((choice) =>
      choice.id === choiceId ? { ...choice, ...updatedChoice } : choice
    ),
  };
};

// Delete a node
export const deleteNode = (nodes: StoryNode[], nodeId: string): StoryNode[] => {
  return nodes.filter((node) => node.id !== nodeId);
};

// Validate story tree - checks for circular references and unreachable nodes
export const validateStoryTree = (
  nodes: StoryNode[],
  startNodeId: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const visited = new Set<string>();
  const nodeMap = new Map<string, StoryNode>();

  // Create a map of nodes for easy lookup
  nodes.forEach((node) => nodeMap.set(node.id, node));

  // Check if start node exists
  if (!nodeMap.has(startNodeId)) {
    errors.push(`Start node with ID "${startNodeId}" does not exist.`);
    return { valid: false, errors };
  }

  // Recursive function to check for circular references
  const checkNode = (nodeId: string, path: string[]): boolean => {
    if (visited.has(nodeId)) {
      errors.push(
        `Circular reference detected: ${path.join(" -> ")} -> ${nodeId}`
      );
      return false;
    }

    const node = nodeMap.get(nodeId);
    if (!node) {
      errors.push(`Node with ID "${nodeId}" not found in tree.`);
      return false;
    }

    visited.add(nodeId);

    for (const choice of node.choices) {
      if (choice.nextNodeId) {
        checkNode(choice.nextNodeId, [...path, nodeId]);
      }
    }

    return true;
  };

  // Start validation from the start node
  checkNode(startNodeId, []);

  // Check for unreachable nodes
  nodes.forEach((node) => {
    if (!visited.has(node.id) && node.id !== startNodeId) {
      errors.push(`Node "${node.id}" (${node.title}) is unreachable.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Helper function to find a node by ID
export const findNodeById = (
  nodes: StoryNode[],
  nodeId: string
): StoryNode | undefined => {
  return nodes.find((node) => node.id === nodeId);
};

// Helper function to get all choices from a node
export const getNodeChoices = (node: StoryNode): StoryChoice[] => {
  return node.choices;
};

// Helper function to get next node from a choice
export const getNextNode = (
  nodes: StoryNode[],
  choice: StoryChoice
): StoryNode | undefined => {
  return findNodeById(nodes, choice.nextNodeId);
};
