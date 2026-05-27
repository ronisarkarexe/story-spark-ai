const content = () => {
  const overview = [
    `Linked List deletion involves removing nodes from the linked data structure at various positions. Unlike arrays, linked lists allow efficient deletion at any point without requiring shifting of remaining elements.`,
    `Deletion is a fundamental operation that enables dynamic modification of the list. The efficiency varies based on deletion position, from O(1) for head to O(n) for arbitrary positions or tail (without tail pointer).`,
    `Proper deletion requires careful pointer manipulation to maintain list integrity and avoid memory leaks (in languages without garbage collection).`,
  ];

  const deletionTypes = [
    { 
      name: "Deletion at Head", 
      complexity: "O(1)", 
      description: "Removes the first node, making the next node the new head",
      code: `function deleteHead() {
  if (!head) return; // Empty list
  
  const temp = head;
  head = head.next;
  
  // In languages without GC:
  // temp.next = null; // Isolate node
  // free(temp);       // Free memory
  
  // Special case: If list becomes empty
  if (!head) tail = null;
}`
    },
    { 
      name: "Deletion at Tail", 
      complexity: "O(n) without tail pointer, O(1) with doubly linked list", 
      description: "Removes the last node, requiring traversal to find new tail",
      code: `function deleteTail() {
  if (!head) return; // Empty list
  
  // Single node case
  if (!head.next) {
    head = null;
    tail = null;
    return;
  }
  
  // Traverse to find node before tail
  let current = head;
  while (current.next && current.next.next) {
    current = current.next;
  }
  
  // Now current is the new tail
  current.next = null;
  tail = current;
}`
    },
    { 
      name: "Deletion by Value", 
      complexity: "O(n)", 
      description: "Finds and removes first node containing matching value",
      code: `function deleteValue(value) {
  if (!head) return; // Empty list
  
  // Special case: head contains value
  if (head.data === value) {
    deleteHead();
    return;
  }
  
  let current = head;
  while (current.next && current.next.data !== value) {
    current = current.next;
  }
  
  if (current.next) {
    const toDelete = current.next;
    current.next = toDelete.next;
    
    // Update tail if deleting last node
    if (!current.next) tail = current;
    
    // In languages without GC:
    // toDelete.next = null;
    // free(toDelete);
  }
}`
    },
    { 
      name: "Deletion at Position", 
      complexity: "O(n)", 
      description: "Removes node at specific index (0-based)",
      code: `function deleteAt(position) {
  if (!head || position < 0) return;
  
  if (position === 0) {
    deleteHead();
    return;
  }
  
  let current = head;
  for (let i = 0; current && i < position-1; i++) {
    current = current.next;
  }
  
  if (!current || !current.next) return; // Out of bounds
  
  const toDelete = current.next;
  current.next = toDelete.next;
  
  // Update tail if deleting last node
  if (!current.next) tail = current;
  
  // Memory cleanup in non-GC languages
  // toDelete.next = null;
  // free(toDelete);
}`
    },
  ];

  const headDeletionSteps = [
    { step: "Check if list is empty (head is null)" },
    { step: "Store reference to current head node" },
    { step: "Update head pointer to head.next" },
    { step: "Handle memory cleanup (if needed)" },
    { step: "Special case: If list becomes empty, update tail pointer" },
  ];

  const tailDeletionSteps = [
    { step: "Check for empty list" },
    { step: "Handle single node case separately" },
    { step: "Traverse to find node before tail (penultimate node)" },
    { step: "Set penultimate node's next to null" },
    { step: "Update tail pointer to penultimate node" },
  ];

  const middleDeletionSteps = [
    { step: "Traverse to find node before target node" },
    { step: "Update previous node's next pointer to skip target" },
    { step: "Handle special case when deleting last node" },
    { step: "Perform memory cleanup (if needed)" },
  ];

  const visualization = [
    { operation: "Initial State", state: "head → [A] → [B] → [C] → [D] → null" },
    { operation: "deleteHead()", state: "head → [B] → [C] → [D] → null" },
    { operation: "deleteTail()", state: "head → [B] → [C] → null" },
    { operation: "deleteValue('C')", state: "head → [B] → null" },
    { operation: "deleteAt(0)", state: "head → null" },
  ];

  const edgeCases = [
    "Empty list (head = null)",
    "Single node list (head = tail)",
    "Deleting head node",
    "Deleting tail node",
    "Deleting non-existent value",
    "Deleting at invalid position (negative or out of bounds)",
    "Memory management in non-GC languages",
  ];

  const bestPractices = [
    "Always check for empty list before deletion",
    "Maintain proper head/tail pointers after deletion",
    "Handle single node case separately",
    "In non-GC languages, properly free deleted node memory",
    "Consider using dummy nodes to simplify edge cases",
    "Document position/indexing scheme (0-based vs 1-based)",
    "Validate position bounds before deletion attempts",
  ];

  const comparisonTable = [
    { 
      feature: "Time Complexity", 
      array: "O(n) (requires shifting)", 
      linkedList: "O(1) head, O(n) arbitrary/tail" 
    },
    { 
      feature: "Space Complexity", 
      array: "O(1)", 
      linkedList: "O(1)" 
    },
    { 
      feature: "Memory Usage", 
      array: "Fixed size unless resized", 
      linkedList: "Dynamic, no unused capacity" 
    },
    { 
      feature: "Implementation", 
      array: "Simple indexing", 
      linkedList: "Pointer manipulation" 
    },
    { 
      feature: "Best For", 
      array: "Frequent random access", 
      linkedList: "Frequent deletions at head" 
    },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview Section */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Deletion
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {overview.map((para, index) => (
              <p key={index} className="text-[#374151] dark:text-[#d1d5db] mb-3 leading-relaxed">
                {para}
              </p>
            ))}
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>Key Consideration:</strong> Proper deletion requires maintaining list connectivity and handling memory appropriately to prevent leaks (in manual memory management environments).
              </p>
            </div>
          </div>
        </section>

        {/* Deletion Types */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Deletion Types</h2>
          <div className="space-y-6">
            {deletionTypes.map((type, index) => (
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

        {/* Deletion Processes */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Deletion Processes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Head Deletion */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Head Deletion</h3>
              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {headDeletionSteps.map((step, index) => (
                  <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                    {step.step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Tail Deletion */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tail Deletion</h3>
              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {tailDeletionSteps.map((step, index) => (
                  <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                    {step.step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Middle Deletion */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Middle Deletion</h3>
              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {middleDeletionSteps.map((step, index) => (
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comparison with Array Deletion</h2>
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
              <strong>When to Choose:</strong> Prefer linked lists when you need frequent deletions, especially at the head. Use arrays when you need index-based access and memory efficiency for small, fixed-size collections.
            </p>
          </div>
        </section>

        {/* Final Notes */}
        <section className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Implementation Notes</h2>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="list-disc pl-5 space-y-2 marker:text-primary dark:marker:text-[#c27cf7]">
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Memory Management:</strong> In languages without garbage collection, ensure proper memory deallocation when deleting nodes
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Error Handling:</strong> Implement robust checks for edge cases to prevent null pointer exceptions
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Testing:</strong> Thoroughly test all deletion scenarios including empty list, single-node list, head/tail deletions
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Optimizations:</strong> For frequent tail deletions, consider using a doubly linked list for O(1) performance
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Documentation:</strong> Clearly document whether your deletion methods return the deleted value or just remove it
              </li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
};

export default content;