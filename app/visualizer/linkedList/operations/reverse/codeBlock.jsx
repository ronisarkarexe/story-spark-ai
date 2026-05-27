'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';
import CodeExamples from '@/app/visualizer/linkedList/operations/reverse/data/codeExamples.json';

// ─── Code Examples ─────────────────────────────
const codeExamples = CodeExamples;

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'linkedListReverse.js',
    python:'linked_list_reverse.py',
    java:'LinkedListReverse.java',
    c:'linked_list_reverse.c',
    cpp:'linked_list_reverse.cpp'
};

// ─── Component ─────────────────────────────
const LinkedListReverseCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default LinkedListReverseCode;