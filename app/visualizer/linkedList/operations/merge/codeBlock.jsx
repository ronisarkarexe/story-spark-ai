'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';
import CodeExamples from '@/app/visualizer/linkedList/operations/merge/data/codeExamples.json';

// ─── Code Examples ─────────────────────────────
const codeExamples = CodeExamples;

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'linkedListMerge.js',
    python:'linked_list_merge.py',
    java:'LinkedListMerge.java',
    c:'linked_list_merge.c',
    cpp:'linked_list_merge.cpp'
};

// ─── Component ─────────────────────────────
const LinkedListMergeCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default LinkedListMergeCode;