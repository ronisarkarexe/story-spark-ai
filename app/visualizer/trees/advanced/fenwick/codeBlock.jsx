'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Fenwick Tree ─────────────────────────
const codeExamples = {
  javascript: `// Fenwick Tree (Binary Indexed Tree)
class FenwickTree{

    constructor(n){

        this.n=n;

        this.tree=
        new Array(
        n+1
        ).fill(0);
    }

    // Returns prefix sum
    query(index){

        let sum=0;

        while(
        index>0
        ){

            sum+=
            this.tree[
            index
            ];

            index-=
            index&
            -index;
        }

        return sum;
    }

    // Update value
    update(
        index,
        value){

        while(
        index<=
        this.n
        ){

            this.tree[
            index
            ]+=value;

            index+=
            index&
            -index;
        }
    }
}

// Usage
const fenwick=
new FenwickTree(5);

fenwick.update(1,5);
fenwick.update(2,3);

console.log(
fenwick.query(2)
);`,

  python: `# Fenwick Tree

class FenwickTree:

    def __init__(
            self,
            n):

        self.n=n

        self.tree=
        [0]*(n+1)


    def query(
            self,
            index):

        total=0

        while(
        index>0
        ):

            total+=\
            self.tree[
            index
            ]

            index-=\
            index&(
            -index
            )

        return total


    def update(
            self,
            index,
            value):

        while(
        index<=
        self.n
        ):

            self.tree[
            index
            ]+=value

            index+=\
            index&(
            -index
            )


fenwick=
FenwickTree(5)

fenwick.update(
1,5
)

fenwick.update(
2,3
)

print(
fenwick.query(2)
)`,

  cpp: `// Fenwick Tree
#include<iostream>
#include<vector>

using namespace std;

class FenwickTree{

private:

    vector<int>
    tree;

    int n;

public:

    FenwickTree(
            int size){

        n=size;

        tree.resize(
        n+1,
        0
        );
    }

    int query(
            int index){

        int sum=0;

        while(
        index>0
        ){

            sum+=
            tree[
            index
            ];

            index-=
            index&
            -index;
        }

        return sum;
    }

    void update(
            int index,
            int value){

        while(
        index<=n
        ){

            tree[
            index
            ]+=value;

            index+=
            index&
            -index;
        }
    }
};

int main(){

    FenwickTree
    fenwick(5);

    fenwick.update(
    1,5
    );

    fenwick.update(
    2,3
    );

    cout
    <<fenwick.query(
    2
    );

    return 0;
}`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'fenwickTree.js',
    python:'fenwick_tree.py',
    cpp:'fenwick_tree.cpp'
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
