import TreeBSTVisualizer from "../TreeBSTVisualizer";

export const metadata = {
  title: "BST Deletion Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Learn how deleting nodes works in a Binary Search Tree, visualizing leaf, single-child, and two-children predecessor/successor deletions.",
  keywords: ["BST Deletion", "Delete Node BST", "Inorder Successor Deletion", "DSA Visualizations"],
  robots: "index, follow",
};

const BSTDeletionPage = () => {
  return <TreeBSTVisualizer initialMode="deletion" />;
};

export default BSTDeletionPage;
