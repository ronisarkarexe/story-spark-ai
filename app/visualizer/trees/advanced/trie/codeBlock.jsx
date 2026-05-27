'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Trie ─────────────────────────
const codeExamples = {
  javascript: `// Trie Implementation
class TrieNode{

    constructor(){

        this.children={};
        this.isEndOfWord=false;
    }
}

class Trie{

    constructor(){

        this.root=
        new TrieNode();
    }

    insert(word){

        let node=
        this.root;

        for(
        let char
        of word
        ){

            if(
            !node.children[
            char
            ]
            ){

                node.children[
                char
                ]=
                new TrieNode();
            }

            node=
            node.children[
            char
            ];
        }

        node.isEndOfWord=
        true;
    }

    search(word){

        let node=
        this.root;

        for(
        let char
        of word
        ){

            if(
            !node.children[
            char
            ]
            ){

                return false;
            }

            node=
            node.children[
            char
            ];
        }

        return node
        .isEndOfWord;
    }

    startsWith(prefix){

        let node=
        this.root;

        for(
        let char
        of prefix
        ){

            if(
            !node.children[
            char
            ]
            ){

                return false;
            }

            node=
            node.children[
            char
            ];
        }

        return true;
    }
}

// Usage
const trie=
new Trie();

trie.insert(
"apple"
);

console.log(
trie.search(
"apple"
));

console.log(
trie.startsWith(
"app"
));`,

  python: `# Trie Implementation

class TrieNode:

    def __init__(
            self):

        self.children={}
        self.is_end=False


class Trie:

    def __init__(
            self):

        self.root=
        TrieNode()


    def insert(
            self,
            word):

        node=
        self.root

        for char in word:

            if(
            char not in
            node.children
            ):

                node.children[
                char
                ]=TrieNode()

            node=
            node.children[
            char
            ]

        node.is_end=
        True


    def search(
            self,
            word):

        node=
        self.root

        for char in word:

            if(
            char not in
            node.children
            ):

                return False

            node=
            node.children[
            char
            ]

        return node.is_end


    def starts_with(
            self,
            prefix):

        node=
        self.root

        for char in prefix:

            if(
            char not in
            node.children
            ):

                return False

            node=
            node.children[
            char
            ]

        return True`,

  java: `// Trie Implementation

class TrieNode{

    TrieNode[]
    children=
    new TrieNode[26];

    boolean
    isEnd=false;
}

public class Trie{

    private
    TrieNode root;

    public Trie(){

        root=
        new TrieNode();
    }

    public void insert(
            String word){

        TrieNode node=
        root;

        for(
        int i=0;
        i<
        word.length();
        i++
        ){

            int index=
            word.charAt(
            i
            )-'a';

            if(
            node.children[
            index
            ]==null
            ){

                node.children[
                index
                ]=
                new TrieNode();
            }

            node=
            node.children[
            index
            ];
        }

        node.isEnd=
        true;
    }
}`,

  c: `// Trie Implementation
#include<stdio.h>
#include<stdlib.h>
#include<stdbool.h>

typedef struct TrieNode{

    struct TrieNode*
    children[26];

    bool isEnd;

}TrieNode;

TrieNode*
createNode(){

    TrieNode*
    node=

    (TrieNode*)
    malloc(
    sizeof(
    TrieNode
    ));

    node->isEnd=
    false;

    for(
    int i=0;
    i<26;
    i++
    ){

        node->children[i]
        =NULL;
    }

    return node;
}`,

  cpp: `// Trie Implementation
#include<iostream>
#include<unordered_map>

using namespace std;

class TrieNode{

public:

    unordered_map<
    char,
    TrieNode*
    > children;

    bool isEnd=
    false;
};

class Trie{

private:

    TrieNode*
    root;

public:

    Trie(){

        root=
        new TrieNode();
    }

    void insert(
            string word){

        TrieNode*
        node=root;

        for(
        char c:
        word
        ){

            if(
            node
            ->children
            .find(c)==
            node
            ->children
            .end()
            ){

                node
                ->children[c]
                =new TrieNode();
            }

            node=
            node
            ->children[c];
        }

        node->isEnd=
        true;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'trie.js',
    python:'trie.py',
    java:'Trie.java',
    c:'trie.c',
    cpp:'trie.cpp'
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
