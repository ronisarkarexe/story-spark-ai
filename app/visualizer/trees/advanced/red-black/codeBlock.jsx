'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Red-Black Tree ─────────────────────────
const codeExamples = {
  javascript: `// Red-Black Tree Implementation

const COLOR={
    RED:"RED",
    BLACK:"BLACK"
};

class Node{

    constructor(
        data,
        color=
        COLOR.RED
    ){

        this.data=data;
        this.color=color;

        this.left=null;
        this.right=null;
        this.parent=null;
    }
}

class RedBlackTree{

    constructor(){

        this.TNULL=
        new Node(
        0,
        COLOR.BLACK
        );

        this.root=
        this.TNULL;
    }

    leftRotate(x){

        let y=
        x.right;

        x.right=
        y.left;

        if(
        y.left!==
        this.TNULL
        ){

            y.left.parent=x;
        }

        y.parent=
        x.parent;

        if(
        x.parent===
        null
        ){

            this.root=y;
        }

        else if(
        x===
        x.parent.left
        ){

            x.parent.left=y;
        }

        else{

            x.parent.right=y;
        }

        y.left=x;

        x.parent=y;
    }

    rightRotate(x){

        let y=
        x.left;

        x.left=
        y.right;

        if(
        y.right!==
        this.TNULL
        ){

            y.right.parent=x;
        }

        y.parent=
        x.parent;

        if(
        x.parent===
        null
        ){

            this.root=y;
        }

        else if(
        x===
        x.parent.right
        ){

            x.parent.right=y;
        }

        else{

            x.parent.left=y;
        }

        y.right=x;

        x.parent=y;
    }
}`,

  python: `# Red-Black Tree

class Node:

    def __init__(
            self,
            data,
            color="RED"):

        self.data=data
        self.color=color

        self.left=None
        self.right=None
        self.parent=None


class RedBlackTree:

    def __init__(
            self):

        self.TNULL=
        Node(
        0,
        "BLACK"
        )

        self.root=
        self.TNULL


    def left_rotate(
            self,
            x):

        y=x.right

        x.right=
        y.left

        if(
        y.left!=
        self.TNULL
        ):

            y.left.parent=x

        y.parent=
        x.parent

        if(
        x.parent
        is None
        ):

            self.root=y

        elif(
        x==
        x.parent.left
        ):

            x.parent.left=y

        else:

            x.parent.right=y

        y.left=x

        x.parent=y`,

  java: `// Red-Black Tree

class Node{

    int data;

    Node left;
    Node right;
    Node parent;

    int color;

    Node(
        int data){

        this.data=
        data;

        color=0;
    }
}

public class RedBlackTree{

    private Node root;

    private Node TNULL;

    public RedBlackTree(){

        TNULL=
        new Node(0);

        TNULL.color=1;

        root=TNULL;
    }

    public void leftRotate(
            Node x){

        Node y=
        x.right;

        x.right=
        y.left;

        if(
        y.left!=
        TNULL
        ){

            y.left.parent=x;
        }

        y.parent=
        x.parent;

        if(
        x.parent==
        null
        ){

            root=y;
        }

        else if(
        x==
        x.parent.left
        ){

            x.parent.left=y;
        }

        else{

            x.parent.right=y;
        }

        y.left=x;

        x.parent=y;
    }
}`,

  cpp: `// Red-Black Tree
#include<iostream>

using namespace std;

enum Color{
    RED,
    BLACK
};

struct Node{

    int data;

    Node* parent;
    Node* left;
    Node* right;

    Color color;
};

class RedBlackTree{

private:

    Node* root;
    Node* TNULL;

public:

    RedBlackTree(){

        TNULL=
        new Node;

        TNULL->color=
        BLACK;

        TNULL->left=
        nullptr;

        TNULL->right=
        nullptr;

        root=
        TNULL;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'redBlackTree.js',
    python:'red_black_tree.py',
    java:'RedBlackTree.java',
    cpp:'red_black_tree.cpp'
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
