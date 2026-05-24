import TreeBSTVisualizer from "../TreeBSTVisualizer";

export const metadata = {
  title: "BST Search Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Learn how searching works in Binary Search Trees with step-by-step interactive animations, pseudocode highlighting, and quizzes.",
  keywords: ["BST Search", "Binary Search Tree", "BST Traversal", "DSA Visualizations"],
  robots: "index, follow",
};

const BSTSearchPage = () => {
  return <TreeBSTVisualizer initialMode="searching" />;
};

export default BSTSearchPage;
