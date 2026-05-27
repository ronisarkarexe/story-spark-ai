"use client";
import SharedCodeBlock from "@/app/components/ui/SharedCodeBlock";

export default function HuffmanCodeBlock() {
  const codeExamples = {
    javascript: `class Node {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

function buildHuffmanTree(chars, freqs) {
  let pq = [];
  for (let i = 0; i < chars.length; i++) {
    pq.push(new Node(chars[i], freqs[i]));
  }
  
  pq.sort((a, b) => a.freq - b.freq);

  while (pq.length > 1) {
    let left = pq.shift();
    let right = pq.shift();

    let sumNode = new Node(null, left.freq + right.freq);
    sumNode.left = left;
    sumNode.right = right;

    pq.push(sumNode);
    pq.sort((a, b) => a.freq - b.freq);
  }
  return pq[0];
}`,
    python: `import heapq

class Node:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None

    def __lt__(self, other):
        return self.freq < other.freq

def buildHuffmanTree(chars, freqs):
    pq = []
    for i in range(len(chars)):
        heapq.heappush(pq, Node(chars[i], freqs[i]))

    while len(pq) > 1:
        left = heapq.heappop(pq)
        right = heapq.heappop(pq)

        sumNode = Node(None, left.freq + right.freq)
        sumNode.left = left
        sumNode.right = right

        heapq.heappush(pq, sumNode)

    return heapq.heappop(pq)`,
    java: `import java.util.PriorityQueue;

class Node implements Comparable<Node> {
    char ch;
    int freq;
    Node left, right;

    Node(char ch, int freq) {
        this.ch = ch;
        this.freq = freq;
    }
    
    public int compareTo(Node other) {
        return this.freq - other.freq;
    }
}

public Node buildHuffmanTree(char[] chars, int[] freqs) {
    PriorityQueue<Node> pq = new PriorityQueue<>();

    for (int i = 0; i < chars.length; i++) {
        pq.add(new Node(chars[i], freqs[i]));
    }

    while (pq.size() > 1) {
        Node left = pq.poll();
        Node right = pq.poll();

        Node sumNode = new Node('\\0', left.freq + right.freq);
        sumNode.left = left;
        sumNode.right = right;

        pq.add(sumNode);
    }

    return pq.poll();
}`,
    cpp: `#include <queue>
#include <vector>

using namespace std;

struct Node {
    char ch;
    int freq;
    Node *left, *right;

    Node(char c, int f) {
        ch = c;
        freq = f;
        left = right = nullptr;
    }
};

struct compare {
    bool operator()(Node* l, Node* r) {
        return (l->freq > r->freq);
    }
};

Node* buildHuffmanTree(vector<char> chars, vector<int> freqs) {
    priority_queue<Node*, vector<Node*>, compare> pq;

    for (int i = 0; i < chars.size(); ++i)
        pq.push(new Node(chars[i], freqs[i]));

    while (pq.size() > 1) {
        Node *left = pq.top(); pq.pop();
        Node *right = pq.top(); pq.pop();

        Node *sumNode = new Node('\\0', left->freq + right->freq);
        sumNode->left = left;
        sumNode->right = right;

        pq.push(sumNode);
    }

    return pq.top();
}`
  };

  return <SharedCodeBlock title="Huffman Coding Implementation" codeExamples={codeExamples} color="text-purple-500" />;
}
