'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';
import CodeExamples from '@/app/visualizer/linkedList/operations/insertion/data/codeExamples.json';

// ─── Code Examples ─────────────────────────────
const codeExamples = CodeExamples;

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'linkedListInsertion.js',
    python:'linked_list_insertion.py',
    java:'LinkedListInsertion.java',
    c:'linked_list_insertion.c',
    cpp:'linked_list_insertion.cpp'
};

// ─── Component ─────────────────────────────
const LinkedListInsertionCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default LinkedListInsertionCode;