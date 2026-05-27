"use client";
import SharedCodeBlock from "@/app/components/ui/SharedCodeBlock";

export default function DiameterCodeBlock() {
  const codeExamples = {
    javascript: `function diameterOfBinaryTree(root) {
  let diameter = 0;
  
  function height(node) {
    if (!node) return 0;
    
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);
    
    diameter = Math.max(diameter, leftHeight + rightHeight);
    
    return Math.max(leftHeight, rightHeight) + 1;
  }
  
  height(root);
  return diameter;
}`,
    python: `def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
    self.diameter = 0
    
    def height(node):
        if not node:
            return 0
            
        left_height = height(node.left)
        right_height = height(node.right)
        
        self.diameter = max(self.diameter, left_height + right_height)
        
        return max(left_height, right_height) + 1
        
    height(root)
    return self.diameter`,
    java: `int diameter = 0;

public int diameterOfBinaryTree(TreeNode root) {
    height(root);
    return diameter;
}

private int height(TreeNode node) {
    if (node == null) return 0;
    
    int leftHeight = height(node.left);
    int rightHeight = height(node.right);
    
    diameter = Math.max(diameter, leftHeight + rightHeight);
    
    return Math.max(leftHeight, rightHeight) + 1;
}`,
    cpp: `int diameter = 0;

int diameterOfBinaryTree(TreeNode* root) {
    height(root);
    return diameter;
}

int height(TreeNode* node) {
    if (!node) return 0;
    
    int leftHeight = height(node->left);
    int rightHeight = height(node->right);
    
    diameter = max(diameter, leftHeight + rightHeight);
    
    return max(leftHeight, rightHeight) + 1;
}`
  };

  return <SharedCodeBlock title="Tree Diameter Code" codeExamples={codeExamples} color="text-cyan-500" />;
}
