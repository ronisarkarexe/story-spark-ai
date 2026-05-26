'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Segment Tree ─────────────────────────
const codeExamples = {
  javascript: `// Segment Tree (Range Sum Query)
class SegmentTree{

    constructor(arr){

        this.n=arr.length;

        this.tree=
        new Array(
        4*this.n
        ).fill(0);

        if(
        this.n>0
        ){

            this.build(
                arr,
                0,
                0,
                this.n-1
            );
        }
    }

    build(
        arr,
        node,
        start,
        end){

        if(
        start===end
        ){

            this.tree[
            node
            ]=arr[start];

            return;
        }

        let mid=
        Math.floor(
        (start+end)/2
        );

        this.build(
        arr,
        2*node+1,
        start,
        mid
        );

        this.build(
        arr,
        2*node+2,
        mid+1,
        end
        );

        this.tree[node]=
        this.tree[
        2*node+1
        ]+
        this.tree[
        2*node+2
        ];
    }

    query(
        node,
        start,
        end,
        l,
        r){

        if(
        r<start ||
        end<l
        ){

            return 0;
        }

        if(
        l<=start &&
        end<=r
        ){

            return this.tree[
            node
            ];
        }

        let mid=
        Math.floor(
        (start+end)/2
        );

        let left=
        this.query(
        2*node+1,
        start,
        mid,
        l,
        r
        );

        let right=
        this.query(
        2*node+2,
        mid+1,
        end,
        l,
        r
        );

        return left+right;
    }
}`,

  python: `# Segment Tree

class SegmentTree:

    def __init__(
            self,
            arr):

        self.n=
        len(arr)

        self.tree=
        [0]*(
        4*self.n
        )

        if self.n>0:

            self.build(
            arr,
            0,
            0,
            self.n-1
            )


    def build(
            self,
            arr,
            node,
            start,
            end):

        if start==end:

            self.tree[
            node
            ]=arr[start]

            return

        mid=(
        start+end
        )//2

        self.build(
        arr,
        2*node+1,
        start,
        mid
        )

        self.build(
        arr,
        2*node+2,
        mid+1,
        end
        )

        self.tree[node]=\
        self.tree[
        2*node+1
        ]+\
        self.tree[
        2*node+2
        ]


    def query(
            self,
            node,
            start,
            end,
            l,
            r):

        if(
        r<start or
        end<l
        ):

            return 0

        if(
        l<=start and
        end<=r
        ):

            return self.tree[
            node
            ]

        mid=(
        start+end
        )//2

        left=\
        self.query(
        2*node+1,
        start,
        mid,
        l,
        r
        )

        right=\
        self.query(
        2*node+2,
        mid+1,
        end,
        l,
        r
        )

        return left+right`,

  cpp: `// Segment Tree
#include<iostream>
#include<vector>

using namespace std;

class SegmentTree{

private:

    vector<int>
    tree;

    int n;

public:

    SegmentTree(
    const vector<int>& arr){

        n=arr.size();

        tree.resize(
        4*n,
        0
        );

        if(
        n>0
        ){

            build(
            arr,
            0,
            0,
            n-1
            );
        }
    }

    void build(
        const vector<int>& arr,
        int node,
        int start,
        int end){

        if(
        start==end
        ){

            tree[node]=
            arr[start];

            return;
        }

        int mid=
        (start+end)/2;

        build(
        arr,
        2*node+1,
        start,
        mid
        );

        build(
        arr,
        2*node+2,
        mid+1,
        end
        );

        tree[node]=
        tree[
        2*node+1
        ]+
        tree[
        2*node+2
        ];
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'segmentTree.js',
    python:'segment_tree.py',
    cpp:'segment_tree.cpp'
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
