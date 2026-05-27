import TreeTraversalVisualizer from "@/app/visualizer/trees/traversing/TreeTraversalVisualizer";

export const metadata = {
  title: 'In-Order Traversal Visualizer | AlgoBuddy',
  description: 'Visualize In-Order (Left → Root → Right) binary tree traversal step-by-step with interactive animations, pseudocode highlighting, and quizzes.',
  keywords: ['In-Order Traversal', 'Binary Tree', 'BST', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
};

const InOrderPage = () => {
  return <TreeTraversalVisualizer initialMode="in-order" />;
};

export default InOrderPage;
