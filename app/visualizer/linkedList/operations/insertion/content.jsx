const content = () => {
  const overview = [
    `Linked List insertion involves adding new nodes to the linked data structure at various positions. Unlike arrays, linked lists allow efficient insertion at any point without reallocation or shifting of existing elements.`,
    `Insertion is a fundamental operation that enables dynamic growth of the list. The efficiency varies based on insertion position, from O(1) for head/tail (with tail pointer) to O(n) for arbitrary positions.`,
    `Mastering insertion techniques is crucial for building more complex data structures and algorithms that utilize linked lists as their foundation.`,
  ];

  const insertionTypes = [
    { 
      name: "Insertion at Head", 
      complexity: "O(1)", 
      description: "Adds new node at the beginning, making it the new head",
      code: `function insertHead(data) {
  const newNode = new Node(data);
  newNode.next = head;
  head = newNode;
}`
    },
    { 
      name: "Insertion at Tail", 
      complexity: "O(1) with tail pointer, O(n) without", 
      description: "Appends new node at the end of the list",
      code: `function insertTail(data) {
  const newNode = new Node(data);
  if (!head) {
    head = newNode;
    tail = newNode;
  } else {
    tail.next = newNode;
    tail = newNode;
  }
}`
    },
    { 
      name: "Insertion at Position", 
      complexity: "O(n)", 
      description: "Inserts node at specific index (0-based)",
      code: `function insertAt(data, position) {
  if (position === 0) return insertHead(data);
  
  let current = head;
  for (let i = 0; i < position-1 && current; i++) {
    current = current.next;
  }
  
  if (!current) return; // Position out of bounds
  
  const newNode = new Node(data);
  newNode.next = current.next;
  current.next = newNode;
  
  if (!newNode.next) tail = newNode;
}`
    },
    { 
      name: "Insertion After Node", 
      complexity: "O(1)", 
      description: "Inserts new node after a given reference node",
      code: `function insertAfter(refNode, data) {
  const newNode = new Node(data);
  newNode.next = refNode.next;
  refNode.next = newNode;
  
  if (refNode === tail) tail = newNode;
}`
    },
  ];

  const headInsertionSteps = [
    { step: "Create a new node with the given data" },
    { step: "Set the new node's next pointer to current head" },
    { step: "Update the head pointer to point to the new node" },
    { step: "Special case: If list was empty, update tail pointer too" },
  ];

  const tailInsertionSteps = [
    { step: "Create a new node with the given data" },
    { step: "If list is empty, set both head and tail to new node" },
    { step: "Otherwise, set current tail's next pointer to new node" },
    { step: "Update tail pointer to the new node" },
  ];

  const middleInsertionSteps = [
    { step: "Traverse the list to find the insertion position" },
    { step: "Create a new node with the given data" },
    { step: "Set new node's next to the next node of current position" },
    { step: "Set current node's next pointer to the new node" },
    { step: "Special case: If inserting at end, update tail pointer" },
  ];

  const visualization = [
    { operation: "Initial State", state: "head → [A] → [B] → [C] → null" },
    { operation: "insertHead(X)", state: "head → [X] → [A] → [B] → [C] → null" },
    { operation: "insertTail(Y)", state: "head → [X] → [A] → [B] → [C] → [Y] → null" },
    { operation: "insertAt(Z, 2)", state: "head → [X] → [A] → [Z] → [B] → [C] → [Y] → null" },
  ];

  const edgeCases = [
    "Empty list (head = null)",
    "Insertion at position 0 (becomes new head)",
    "Insertion at position = list length (becomes new tail)",
    "Insertion at position > list length (should handle gracefully)",
    "Insertion after tail node (should update tail pointer)",
    "Insertion with invalid node references",
  ];

  const bestPractices = [
    "Always check for empty list condition",
    "Maintain tail pointer for O(1) tail insertion",
    "Validate position bounds before insertion",
    "Update tail pointer when inserting at end",
    "Consider using dummy nodes to simplify edge cases",
    "Document whether position is 0-based or 1-based",
  ];

  const comparisonTable = [
    { 
      feature: "Time Complexity", 
      array: "O(n) (requires shifting)", 
      linkedList: "O(1) head/tail, O(n) arbitrary" 
    },
    { 
      feature: "Space Complexity", 
      array: "O(1) (amortized)", 
      linkedList: "O(1) per insertion" 
    },
    { 
      feature: "Memory Usage", 
      array: "May need reallocation", 
      linkedList: "No reallocation needed" 
    },
    { 
      feature: "Implementation", 
      array: "Simple indexing", 
      linkedList: "Pointer manipulation" 
    },
    { 
      feature: "Best For", 
      array: "Frequent random access", 
      linkedList: "Frequent insertions/deletions" 
    },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview Section */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Insertion
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {overview.map((para, index) => (
              <p key={index} className="text-[#374151] dark:text-[#d1d5db] mb-3 leading-relaxed">
                {para}
              </p>
            ))}
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>Key Insight:</strong> Linked list insertion doesn&apos;t require shifting elements like arrays, but does require careful pointer manipulation to maintain list integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Insertion Types */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Insertion Types</h2>
          <div className="space-y-6">
            {insertionTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{type.name}</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-[#374151] dark:text-[#d1d5db] mb-2"><strong>Complexity:</strong> <span className="font-mono">{type.complexity}</span></p>
                    <p className="text-[#374151] dark:text-[#d1d5db]">{type.description}</p>
                  </div>
                  <div className="flex-1">
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto">
                      <code className="text-gray-800 dark:text-gray-200">{type.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insertion Processes */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Insertion Processes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Head Insertion */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Head Insertion</h3>
              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {headInsertionSteps.map((step, index) => (
                  <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                    {step.step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Tail Insertion */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tail Insertion</h3>
              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {tailInsertionSteps.map((step, index) => (
                  <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                    {step.step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Middle Insertion */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Middle Insertion</h3>
              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {middleInsertionSteps.map((step, index) => (
                  <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                    {step.step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Visualization */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Operation Visualization</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Operation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">List State</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {visualization.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">{item.operation}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[#374151] dark:text-[#d1d5db]">{item.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Edge Cases */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edge Cases to Consider</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {edgeCases.map((caseItem, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-yellow-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-[#374151] dark:text-[#d1d5db]">{caseItem}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bestPractices.map((practice, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-[#374151] dark:text-[#d1d5db]">{practice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison with Arrays */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comparison with Array Insertion</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Array</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Linked List</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonTable.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] dark:text-[#d1d5db]">{row.array}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] dark:text-[#d1d5db]">{row.linkedList}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              <strong>When to Choose:</strong> Prefer linked lists when you need frequent insertions at arbitrary positions and don&apos;t require random access. Use arrays when you need index-based access and memory efficiency for small, fixed-size collections.
            </p>
          </div>
        </section>

        {/* Final Notes */}
        <section className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Implementation Notes</h2>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="list-disc pl-5 space-y-2 marker:text-blue-500 dark:marker:text-blue-400">
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Memory Management:</strong> Remember to properly allocate memory for new nodes in languages that require manual memory management
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Error Handling:</strong> Always validate input parameters and handle edge cases gracefully
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Testing:</strong> Thoroughly test all insertion scenarios including empty list, single-node list, head/tail insertions
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Optimizations:</strong> Consider maintaining both head and tail pointers for O(1) insertions at both ends
              </li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
};

export default content;
