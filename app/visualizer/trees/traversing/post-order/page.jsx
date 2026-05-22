import TreeTraversalVisualizer from "@/app/visualizer/trees/traversing/TreeTraversalVisualizer";

export const metadata = {
  title: 'Post-Order Traversal Visualizer | AlgoBuddy',
  description: 'Visualize Post-Order (Left → Right → Root) binary tree traversal step-by-step with interactive animations, pseudocode highlighting, and quizzes.',
  keywords: ['Post-Order Traversal', 'Binary Tree', 'BST', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
};

const PostOrderPage = () => {
  return <TreeTraversalVisualizer initialMode="post-order" />;
};

export default PostOrderPage;
