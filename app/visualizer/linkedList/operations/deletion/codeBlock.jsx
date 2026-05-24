'use client';

import AppleCodeBlock from '@/app/components/ui/AppleCodeBlock';
import CodeExamples from '@/app/visualizer/linkedList/operations/deletion/data/codeExamples.json';

// ─── Code Examples ─────────────────────────────
const codeExamples = CodeExamples;

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'linkedListDeletion.js',
    python:'linked_list_deletion.py',
    java:'LinkedListDeletion.java',
    c:'linked_list_deletion.c',
    cpp:'linked_list_deletion.cpp'
};

// ─── Component ─────────────────────────────
const CodeBlock = () => (
    <AppleCodeBlock
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;