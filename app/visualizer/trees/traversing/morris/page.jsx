import TreeTraversalVisualizer from "@/app/visualizer/trees/traversing/TreeTraversalVisualizer";

export const metadata = {
  title: 'Morris Traversal Visualizer | AlgoBuddy',
  description: 'Visualize Morris Traversal (threaded binary tree, O(1) space) step-by-step with dynamic thread link animations, pseudocode highlighting, and quizzes.',
  keywords: ['Morris Traversal', 'Threaded Binary Tree', 'O(1) Space', 'Binary Tree', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
};

const MorrisPage = () => {
  return <TreeTraversalVisualizer initialMode="morris" />;
};

export default MorrisPage;
