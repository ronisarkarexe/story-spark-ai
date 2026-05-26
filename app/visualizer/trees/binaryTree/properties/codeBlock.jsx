'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Binary Tree Operations ───────────────────
const codeExamples = {
  javascript: `// Binary Tree Operations

class Node{

    constructor(value){

        this.value=value;
        this.left=null;
        this.right=null;
    }
}

function getHeight(node){

    if(node===null)
        return -1;

    return 1+
    Math.max(
        getHeight(
        node.left
        ),
        getHeight(
        node.right
        )
    );
}

function getDepth(
        root,
        target,
        currentDepth=0){

    if(root===null)
        return -1;

    if(root===target)
        return currentDepth;

    let leftDepth=
    getDepth(
    root.left,
    target,
    currentDepth+1
    );

    if(
    leftDepth!==-1
    ){

        return leftDepth;
    }

    return getDepth(
    root.right,
    target,
    currentDepth+1
    );
}

function countLeaves(node){

    if(node===null)
        return 0;

    if(
    node.left===null &&
    node.right===null
    ){
        return 1;
    }

    return countLeaves(
    node.left
    )+
    countLeaves(
    node.right
    );
}`,

  python: `# Binary Tree Operations

class Node:

    def __init__(
            self,
            value):

        self.value=value
        self.left=None
        self.right=None


def get_height(
        node):

    if node is None:

        return -1

    return 1+max(
        get_height(
        node.left
        ),
        get_height(
        node.right
        )
    )


def get_depth(
        root,
        target,
        current_depth=0):

    if root is None:

        return -1

    if root==target:

        return current_depth

    left_depth=
    get_depth(
    root.left,
    target,
    current_depth+1
    )

    if left_depth!=-1:

        return left_depth

    return get_depth(
    root.right,
    target,
    current_depth+1
    )


def count_leaves(
        node):

    if node is None:

        return 0

    if(
    node.left is None
    and
    node.right is None
    ):

        return 1

    return (
    count_leaves(
    node.left
    )+
    count_leaves(
    node.right
    ))`,

  java: `// Binary Tree Operations

class Node{

    int value;

    Node left;
    Node right;

    Node(
        int value){

        this.value=
        value;
    }
}

public class BinaryTreeOperations{

    public static int
    getHeight(
    Node node){

        if(node==null)
            return -1;

        return 1+
        Math.max(
        getHeight(
        node.left
        ),
        getHeight(
        node.right
        ));
    }

    public static int
    getDepth(
    Node root,
    Node target,
    int currentDepth){

        if(root==null)
            return -1;

        if(root==target)
            return currentDepth;

        int leftDepth=
        getDepth(
        root.left,
        target,
        currentDepth+1
        );

        if(
        leftDepth!=-1
        ){

            return leftDepth;
        }

        return getDepth(
        root.right,
        target,
        currentDepth+1
        );
    }

    public static int
    countLeaves(
    Node node){

        if(node==null)
            return 0;

        if(
        node.left==null
        &&
        node.right==null
        ){

            return 1;
        }

        return countLeaves(
        node.left
        )+
        countLeaves(
        node.right
        );
    }
}`,

  c: `// Binary Tree Operations
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
    newNode=

    (struct Node*)
    malloc(
    sizeof(
    struct Node
    ));

    newNode->value=
    value;

    newNode->left=
    NULL;

    newNode->right=
    NULL;

    return newNode;
}

int getHeight(
        struct Node*
        node){

    if(
    node==NULL
    )
        return -1;

    int left=
    getHeight(
    node->left
    );

    int right=
    getHeight(
    node->right
    );

    return 1+
    (
    left>right
    ?left:right
    );
}`,

  cpp: `// Binary Tree Operations
#include<iostream>
#include<algorithm>

using namespace std;

struct Node{

    int value;

    Node* left;
    Node* right;

    Node(
        int val){

        value=val;

        left=
        nullptr;

        right=
        nullptr;
    }
};

int getHeight(
        Node* node){

    if(
    node==
    nullptr
    )
        return -1;

    return 1+
    max(
    getHeight(
    node->left
    ),
    getHeight(
    node->right
    ));
}`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'binaryTree.js',
    python:'binary_tree.py',
    java:'BinaryTreeOperations.java',
    c:'binary_tree.c',
    cpp:'binary_tree.cpp'
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
