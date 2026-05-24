'use client';

import AppleCodeBlock from '@/app/components/ui/AppleCodeBlock';
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
const CodeBlock = () => (
    <AppleCodeBlock
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;