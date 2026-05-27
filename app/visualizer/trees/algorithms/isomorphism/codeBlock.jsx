"use client";
import SharedCodeBlock from "@/app/components/ui/SharedCodeBlock";

export default function IsomorphismCodeBlock() {
  const codeExamples = {
    javascript: `function isIsomorphic(root1, root2) {
  if (!root1 && !root2) return true;
  if (!root1 || !root2) return false;
  if (root1.val !== root2.val) return false;

  const noSwap = isIsomorphic(root1.left, root2.left) && 
                 isIsomorphic(root1.right, root2.right);
                 
  const swap = isIsomorphic(root1.left, root2.right) && 
               isIsomorphic(root1.right, root2.left);

  return noSwap || swap;
}`,
    python: `def isIsomorphic(self, root1: Optional[TreeNode], root2: Optional[TreeNode]) -> bool:
    if not root1 and not root2:
        return True
    if not root1 or not root2:
        return False
    if root1.val != root2.val:
        return False
        
    no_swap = self.isIsomorphic(root1.left, root2.left) and \\
              self.isIsomorphic(root1.right, root2.right)
              
    swap = self.isIsomorphic(root1.left, root2.right) and \\
           self.isIsomorphic(root1.right, root2.left)
           
    return no_swap or swap`,
    java: `public boolean isIsomorphic(TreeNode root1, TreeNode root2) {
    if (root1 == null && root2 == null) return true;
    if (root1 == null || root2 == null) return false;
    if (root1.val != root2.val) return false;
    
    boolean noSwap = isIsomorphic(root1.left, root2.left) && 
                     isIsomorphic(root1.right, root2.right);
                     
    boolean swap = isIsomorphic(root1.left, root2.right) && 
                   isIsomorphic(root1.right, root2.left);
                   
    return noSwap || swap;
}`,
    cpp: `bool isIsomorphic(TreeNode* root1, TreeNode* root2) {
    if (!root1 && !root2) return true;
    if (!root1 || !root2) return false;
    if (root1->val != root2->val) return false;
    
    bool noSwap = isIsomorphic(root1->left, root2->left) && 
                  isIsomorphic(root1->right, root2->right);
                  
    bool swap = isIsomorphic(root1->left, root2->right) && 
                isIsomorphic(root1->right, root2->left);
                
    return noSwap || swap;
}`
  };

  return <SharedCodeBlock title="Tree Isomorphism Code" codeExamples={codeExamples} color="text-green-500" />;
}
