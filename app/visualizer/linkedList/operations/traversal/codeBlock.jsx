'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';
import CodeExamples from '@/app/visualizer/linkedList/operations/traversal/data/codeExamples.json';

// ─── Code Examples ─────────────────────────────
const codeExamples = CodeExamples;

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'linkedListTraversal.js',
    python:'linked_list_traversal.py',
    java:'LinkedListTraversal.java',
    c:'linked_list_traversal.c',
    cpp:'linked_list_traversal.cpp'
};

// ─── Component ─────────────────────────────
const LinkedListTraversalCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default LinkedListTraversalCode;