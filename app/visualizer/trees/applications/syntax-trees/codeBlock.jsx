"use client";
import SharedCodeBlock from "@/app/components/ui/SharedCodeBlock";

export default function SyntaxTreesCodeBlock() {
  const codeExamples = {
    javascript: `// A simple AST Node and Evaluator in JS
class ASTNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function evaluateAST(node) {
  // If it's a leaf node (a number), return its numeric value
  if (!node.left && !node.right) {
    return parseFloat(node.value);
  }

  // Evaluate left and right subtrees
  const leftVal = evaluateAST(node.left);
  const rightVal = evaluateAST(node.right);

  // Apply the operator
  switch (node.value) {
    case '+': return leftVal + rightVal;
    case '-': return leftVal - rightVal;
    case '*': return leftVal * rightVal;
    case '/': return leftVal / rightVal;
    default: throw new Error("Unknown operator " + node.value);
  }
}

// Representing the expression: 3 + (5 * 2)
const root = new ASTNode('+', 
  new ASTNode('3'),
  new ASTNode('*', new ASTNode('5'), new ASTNode('2'))
);

console.log("Result:", evaluateAST(root)); // Output: 13`,
    python: `class ASTNode:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def evaluate_ast(node):
    if not node.left and not node.right:
        return float(node.value)
        
    left_val = evaluate_ast(node.left)
    right_val = evaluate_ast(node.right)
    
    if node.value == '+': return left_val + right_val
    if node.value == '-': return left_val - right_val
    if node.value == '*': return left_val * right_val
    if node.value == '/': return left_val / right_val
    
    raise ValueError(f"Unknown operator {node.value}")

# Expression: 3 + (5 * 2)
root = ASTNode('+',
    ASTNode('3'),
    ASTNode('*', ASTNode('5'), ASTNode('2'))
)

print("Result:", evaluate_ast(root)) # Output: 13.0`
  };

  return <SharedCodeBlock title="AST Evaluation Code" codeExamples={codeExamples} color="text-purple-500" />;
}
