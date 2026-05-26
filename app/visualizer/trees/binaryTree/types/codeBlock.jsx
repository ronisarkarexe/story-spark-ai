'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Binary Tree Types ──────────────────────
const codeExamples = {
  javascript: `// Binary Tree Types

class Node{

    constructor(value){

        this.value=
        value;

        this.left=
        null;

        this.right=
        null;
    }
}

// Create Binary Tree
const root=
new Node(1);

root.left=
new Node(2);

root.right=
new Node(3);

root.left.left=
new Node(4);

root.left.right=
new Node(5);

console.log(
"Binary Tree created!"
);`,

  python: `# Binary Tree Types

class Node:

    def __init__(
            self,
            value):

        self.value=
        value

        self.left=
        None

        self.right=
        None


root=
Node(1)

root.left=
Node(2)

root.right=
Node(3)

root.left.left=
Node(4)

root.left.right=
Node(5)

print(
"Binary Tree created!"
)`,

  java: `// Binary Tree Types

class Node{

    int value;

    Node left;
    Node right;

    Node(
        int value){

        this.value=
        value;

        left=
        null;

        right=
        null;
    }
}

public class BinaryTreeTypes{

    public static void main(
            String[] args){

        Node root=
        new Node(1);

        root.left=
        new Node(2);

        root.right=
        new Node(3);

        System.out.println(
        "Binary Tree created!"
        );
    }
}`,

  c: `// Binary Tree Types
#include<stdio.h>
#include<stdlib.h>

struct Node{

    int value;

    struct Node*
    left;

    struct Node*
    right;
};

struct Node*
createNode(
        int value){

    struct Node*
    node=

    (struct Node*)
    malloc(
    sizeof(
    struct Node
    ));

    node->value=
    value;

    node->left=
    NULL;

    node->right=
    NULL;

    return node;
}

int main(){

    struct Node*
    root=
    createNode(1);

    root->left=
    createNode(2);

    root->right=
    createNode(3);

    printf(
    "Binary Tree created!\\n"
    );

    return 0;
}`,

  cpp: `// Binary Tree Types
#include<iostream>

using namespace std;

struct Node{

    int value;

    Node* left;
    Node* right;

    Node(
        int val){

        value=
        val;

        left=
        nullptr;

        right=
        nullptr;
    }
};

int main(){

    Node* root=
    new Node(1);

    root->left=
    new Node(2);

    root->right=
    new Node(3);

    cout
    <<"Binary Tree created!"
    <<endl;

    return 0;
}`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'binaryTreeTypes.js',
    python:'binary_tree_types.py',
    java:'BinaryTreeTypes.java',
    c:'binary_tree_types.c',
    cpp:'binary_tree_types.cpp'
};

// ─── Component ─────────────────────────────
const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;