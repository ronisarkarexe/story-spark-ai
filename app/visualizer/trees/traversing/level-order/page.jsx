import TreeTraversalVisualizer from "@/app/visualizer/trees/traversing/TreeTraversalVisualizer";

export const metadata = {
  title: 'Level-Order (BFS) Traversal Visualizer | AlgoBuddy',
  description: 'Visualize Level-Order (Breadth-First Search) binary tree traversal step-by-step with live queue animations, pseudocode highlighting, and quizzes.',
  keywords: ['Level-Order Traversal', 'BFS', 'Binary Tree', 'Breadth First Search', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
};

const LevelOrderPage = () => {
  return <TreeTraversalVisualizer initialMode="level-order" />;
};

export default LevelOrderPage;
