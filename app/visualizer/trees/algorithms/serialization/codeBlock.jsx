"use client";
import SharedCodeBlock from "@/app/components/ui/SharedCodeBlock";

export default function SerializationCodeBlock() {
  const codeExamples = {
    javascript: `class Codec {
  // Encodes a tree to a single string.
  serialize(root) {
    const res = [];
    function dfs(node) {
      if (!node) {
        res.push("N");
        return;
      }
      res.push(node.val.toString());
      dfs(node.left);
      dfs(node.right);
    }
    dfs(root);
    return res.join(",");
  }

  // Decodes your encoded data to tree.
  deserialize(data) {
    const vals = data.split(",");
    let i = 0;
    
    function dfs() {
      if (vals[i] === "N") {
        i++;
        return null;
      }
      const node = new TreeNode(Number(vals[i]));
      i++;
      node.left = dfs();
      node.right = dfs();
      return node;
    }
    return dfs();
  }
}`,
    python: `class Codec:
    def serialize(self, root):
        res = []
        def dfs(node):
            if not node:
                res.append("N")
                return
            res.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
            
        dfs(root)
        return ",".join(res)

    def deserialize(self, data):
        vals = data.split(",")
        self.i = 0
        
        def dfs():
            if vals[self.i] == "N":
                self.i += 1
                return None
                
            node = TreeNode(int(vals[self.i]))
            self.i += 1
            node.left = dfs()
            node.right = dfs()
            return node
            
        return dfs()`,
    java: `public class Codec {
    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("N").append(",");
        } else {
            sb.append(node.val).append(",");
            buildString(node.left, sb);
            buildString(node.right, sb);
        }
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        Queue<String> nodes = new LinkedList<>();
        nodes.addAll(Arrays.asList(data.split(",")));
        return buildTree(nodes);
    }
    
    private TreeNode buildTree(Queue<String> nodes) {
        String val = nodes.remove();
        if (val.equals("N")) return null;
        
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }
}`,
    cpp: `class Codec {
public:
    // Encodes a tree to a single string.
    string serialize(TreeNode* root) {
        if (!root) return "N,";
        return to_string(root->val) + "," + serialize(root->left) + serialize(root->right);
    }

    // Decodes your encoded data to tree.
    TreeNode* deserialize(string data) {
        queue<string> q;
        string s;
        for (char c : data) {
            if (c == ',') {
                q.push(s);
                s = "";
            } else {
                s += c;
            }
        }
        return buildTree(q);
    }
    
private:
    TreeNode* buildTree(queue<string>& q) {
        string s = q.front();
        q.pop();
        if (s == "N") return nullptr;
        
        TreeNode* node = new TreeNode(stoi(s));
        node->left = buildTree(q);
        node->right = buildTree(q);
        return node;
    }
};`
  };

  return <SharedCodeBlock title="Serialize / Deserialize Code" codeExamples={codeExamples} color="text-orange-500" />;
}
