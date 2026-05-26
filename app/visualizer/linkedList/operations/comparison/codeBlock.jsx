'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';
import CodeExamples from '@/app/visualizer/linkedList/operations/comparison/data/codeExamples.json';

// ─── Code Examples ─────────────────────────────
const codeExamples = CodeExamples;

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'linkedListComparison.js',
    python:'linked_list_comparison.py',
    java:'LinkedListComparison.java',
    c:'linked_list_comparison.c',
    cpp:'linked_list_comparison.cpp'
};

// ─── Component ─────────────────────────────
const LinkedListComparisonCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default LinkedListComparisonCode;