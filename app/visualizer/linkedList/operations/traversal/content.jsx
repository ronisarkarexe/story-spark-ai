const content = () => {
  const overview = [
    `Linked List traversal involves visiting each node in the list exactly once, starting from the head and moving through the next pointers until the end is reached.`,
    `Traversal is essential for operations like searching, displaying, or processing each element of the list. It ensures that all elements are accessed in sequence.`,
    `Understanding traversal is a foundational step for more advanced linked list algorithms, including deletion, reversal, and cycle detection.`,
  ];

  const traversalTypes = [
    {
      name: "Iterative Traversal",
      complexity: "O(n)",
      description: "Uses a loop to traverse from head to end of list",
      code: `function traverseIterative() {
  let current = head;
  while (current) {
    console.log(current.data);
    current = current.next;
  }
}`
    },
    {
      name: "Recursive Traversal",
      complexity: "O(n) and O(n) space (due to recursion stack)",
      description: "Uses recursion to print each node from head to end",
      code: `function traverseRecursive(node) {
  if (!node) return;
  console.log(node.data);
  traverseRecursive(node.next);
}`
    }
  ];

  const traversalSteps = [
    { step: "Start from the head node" },
    { step: "Access the data of the current node" },
    { step: "Move to the next node using the next pointer" },
    { step: "Repeat until the current node becomes null" }
  ];

  const visualization = [
    { operation: "Initial State", state: "head → [A] → [B] → [C] → null" },
    { operation: "Traverse", state: "Visited: A → B → C" }
  ];

  const edgeCases = [
    "Empty list (head = null)",
    "Single-node list (head → [A] → null)",
    "List with cycles (can cause infinite traversal if not handled)",
    "Recursive traversal stack overflow for large lists"
  ];

  const bestPractices = [
    "Always check if the list is empty before traversal",
    "Avoid infinite loops by checking for cycles",
    "Use iteration for large lists to prevent stack overflow",
    "Keep traversal read-only unless modifying the list is necessary",
    "Separate logic for display and manipulation for better modularity"
  ];

  const comparisonTable = [
    {
      feature: "Time Complexity",
      array: "O(n)",
      linkedList: "O(n)"
    },
    {
      feature: "Access Method",
      array: "Direct via index",
      linkedList: "Sequential via next pointer"
    },
    {
      feature: "Recursion Friendly",
      array: "Not typically used recursively",
      linkedList: "Supports recursive traversal"
    },
    {
      feature: "Loop Detection Required",
      array: "Not needed",
      linkedList: "May be necessary in some cases"
    }
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview Section */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Traversal
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {overview.map((para, index) => (
              <p key={index} className="text-[#374151] dark:text-[#d1d5db] mb-3 leading-relaxed">
                {para}
              </p>
            ))}
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>Key Insight:</strong> Traversal is the basis for all linked list operations—ensure you visit every node, and beware of cycles that can cause infinite loops.
              </p>
            </div>
          </div>
        </section>

        {/* Traversal Types */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Traversal Types</h2>
          <div className="space-y-6">
            {traversalTypes.map((type, index) => (
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

        {/* Traversal Process */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Traversal Process</h2>
          <div>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {traversalSteps.map((step, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">{step.step}</li>
              ))}
            </ol>
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comparison with Array Traversal</h2>
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
              <strong>When to Choose:</strong> Use arrays for indexed, direct access and linked lists for flexible sequential access and recursive algorithms.
            </p>
          </div>
        </section>

        {/* Final Notes */}
        <section className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Implementation Notes</h2>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="list-disc pl-5 space-y-2 marker:text-primary dark:marker:text-[#c27cf7]">
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Cycle Detection:</strong> Be cautious of loops in the list during traversal, consider Floyd’s algorithm for detection
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Logging:</strong> Use console or UI to log visited nodes during visualization
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Testing:</strong> Test traversal on empty, single-node, and multi-node lists
              </li>
              <li className="text-[#374151] dark:text-[#d1d5db]">
                <strong>Efficiency:</strong> For large lists, prefer iteration to avoid stack issues with recursion
              </li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
};

export default content;