import TreeBSTVisualizer from "../TreeBSTVisualizer";

export const metadata = {
  title: "BST Insertion Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Visualize Binary Search Tree element insertion step-by-step with interactive animations, path highlightings, and quizzes.",
  keywords: ["BST Insertion", "Binary Search Tree", "Insert Node BST", "DSA Visualizations"],
  robots: "index, follow",
};

const BSTInsertionPage = () => {
  return <TreeBSTVisualizer initialMode="insertion" />;
};

export default BSTInsertionPage;
