import TreeTraversalVisualizer from "@/app/visualizer/trees/traversing/TreeTraversalVisualizer";

export const metadata = {
  title: 'Pre-Order Traversal Visualizer | AlgoBuddy',
  description: 'Visualize Pre-Order (Root → Left → Right) binary tree traversal step-by-step with interactive animations, pseudocode highlighting, and quizzes.',
  keywords: ['Pre-Order Traversal', 'Binary Tree', 'BST', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
};

const PreOrderPage = () => {
  return <TreeTraversalVisualizer initialMode="pre-order" />;
};

export default PreOrderPage;
