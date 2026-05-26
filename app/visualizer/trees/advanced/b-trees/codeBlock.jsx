'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for B-Tree ─────────────────────────────
const codeExamples = {
  javascript: `// B-Tree Node Implementation in JavaScript
class BTreeNode{

    constructor(
        t,
        leaf=true
    ){

        this.t=t;
        this.keys=[];
        this.C=[];
        this.leaf=leaf;
    }

    traverse(){

        let i;

        for(
            i=0;
            i<this.keys.length;
            i++
        ){

            if(
            !this.leaf
            ){

                this.C[i]
                .traverse();
            }

            console.log(
            this.keys[i]
            );
        }

        if(
        !this.leaf
        ){

            this.C[i]
            .traverse();
        }
    }

    search(k){

        let i=0;

        while(
        i<this.keys.length &&
        k>this.keys[i]
        ){

            i++;
        }

        if(
        this.keys[i]===k
        ){

            return this;
        }

        if(
        this.leaf
        ){

            return null;
        }

        return this.C[i]
        .search(k);
    }
}`,

  python: `# B-Tree Node Implementation

class BTreeNode:

    def __init__(
            self,
            t,
            leaf=True):

        self.t=t
        self.keys=[]
        self.C=[]
        self.leaf=leaf


    def traverse(
            self):

        for i in range(
            len(
            self.keys
            )):

            if not self.leaf:

                self.C[i]\
                .traverse()

            print(
            self.keys[i]
            )

        if not self.leaf:

            self.C[-1]\
            .traverse()


    def search(
            self,
            k):

        i=0

        while(
        i<len(
        self.keys
        ) and
        k>
        self.keys[i]
        ):

            i+=1

        if(
        i<
        len(self.keys)
        and
        self.keys[i]==k
        ):

            return self

        if self.leaf:

            return None

        return self.C[i]\
        .search(k)`,

  cpp: `// B-Tree Node Implementation
#include<iostream>

using namespace std;

class BTreeNode{

    int *keys;
    int t;

    BTreeNode
    **C;

    int n;

    bool leaf;

public:

    BTreeNode(
            int _t,
            bool _leaf){

        t=_t;

        leaf=
        _leaf;

        keys=
        new int[
        2*t-1
        ];

        C=
        new BTreeNode*
        [2*t];

        n=0;
    }

    void traverse(){

        int i;

        for(
        i=0;
        i<n;
        i++
        ){

            if(
            leaf==
            false
            ){

                C[i]
                ->traverse();
            }

            cout
            <<" "
            <<keys[i];
        }

        if(
        leaf==
        false
        ){

            C[i]
            ->traverse();
        }
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'btree.js',
    python:'btree.py',
    cpp:'btree.cpp'
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
