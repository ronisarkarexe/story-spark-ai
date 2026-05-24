const content = () => {
  const overview = [
    `A Circular Linked List is a variation of a linked list where the last node points back to the first node instead of containing a null reference. This creates a circular structure that can be traversed indefinitely.`,
    `Circular linked lists can be either singly linked (each node has one pointer) or doubly linked (each node has two pointers). The circular nature enables continuous traversal and is particularly useful in round-robin scheduling and buffer implementations.`,
    `The main advantage of circular linked lists is that any node can be a starting point, and the entire list can be traversed from any node. This makes them ideal for applications that require cyclic processing.`,
  ];

  const basicOperations = [
    { name: "Insertion at Head", complexity: "O(1)", description: "Add new node at beginning, point last node to new head" },
    { name: "Insertion at Tail", complexity: "O(1)", description: "Add new node at end, point it to head (with tail pointer)" },
    { name: "Deletion at Head", complexity: "O(1)", description: "Remove first node, update last node's pointer" },
    { name: "Deletion by Value", complexity: "O(n)", description: "Traverse list to find and remove specific node" },
    { name: "Traversal", complexity: "O(n)", description: "Loop through nodes until returning to starting point" },
    { name: "Search", complexity: "O(n)", description: "Traverse list to find element" },
  ];

  const insertionSteps = [
    { step: "1. Create new node with data" },
    { step: "2. If list is empty, set head and tail to new node" },
    { step: "3. Make new node point to itself (circular reference)" },
    { step: "4. For non-empty list, set new node's next to current head" },
    { step: "5. Update tail's next pointer to new node" },
    { step: "6. Move head pointer to new node" },
  ];

  const deletionSteps = [
    { step: "1. Check if list is empty" },
    { step: "2. If single node exists, set head and tail to null" },
    { step: "3. For head deletion, update head to head.next" },
    { step: "4. Update tail's next pointer to new head" },
    { step: "5. For middle deletion, find node and update previous node's pointer" },
    { step: "6. Handle special case when deleting last node" },
  ];

  const prosCons = [
    { point: "Continuous traversal from any node", type: "pro" },
    { point: "Efficient round-robin scheduling", type: "pro" },
    { point: "No need for null checks during traversal", type: "pro" },
    { point: "Useful for circular buffer implementations", type: "pro" },
    { point: "Risk of infinite loops if not handled carefully", type: "con" },
    { point: "Slightly more complex implementation", type: "con" },
    { point: "Harder to detect list boundaries", type: "con" },
  ];

  const visualization = [
    { operation: "Initialization", state: "head → null" },
    { operation: "insertFirst(10)", state: "head → [10] → (points back to head)" },
    { operation: "insertFirst(20)", state: "head → [20] → [10] → (points back to head)" },
    { operation: "insertFirst(30)", state: "head → [30] → [20] → [10] → (points back to head)" },
    { operation: "deleteFirst()", state: "head → [20] → [10] → (points back to head)" },
    { operation: "delete(10)", state: "head → [20] → (points back to itself)" },
  ];

  const applications = [
    "Operating system round-robin scheduling",
    "Multiplayer turn-based games",
    "Music/video playlists with repeat functionality",
    "Resource allocation in networking",
    "Circular buffer implementations",
    "Token ring networks",
  ];

  const comparisonTable = [
    { feature: "Structure", linear: "Linear with null termination", circular: "Circular with no null" },
    { feature: "Traversal", linear: "Stops at end", circular: "Continuous loop" },
    { feature: "Memory Overhead", linear: "Standard", circular: "Same as linear" },
    { feature: "Boundary Detection", linear: "Easy (null check)", circular: "Requires start reference" },
    { feature: "Insert/Delete at Head", linear: "O(1)", circular: "O(1)" },
    { feature: "Implementation Complexity", linear: "Simpler", circular: "More complex" },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview Section */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Circular Linked List
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {overview.map((para, index) => (
              <p key={index} className="text-[#374151] dark:text-[#d1d5db] mb-3 leading-relaxed">
                {para}
              </p>
            ))}
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>Key Property:</strong> The last node&apos;s next pointer always points back to the first node, creating a continuous loop.
              </p>
            </div>
          </div>
        </section>

        {/* Basic Operations */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Operations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Operation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Complexity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {basicOperations.map((op, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{op.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[#374151] dark:text-[#d1d5db]">{op.complexity}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] dark:text-[#d1d5db]">{op.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Insertion Process */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Insertion Process</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {insertionSteps.map((step, index) => (
                  <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                    {step.step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-64 h-32 rounded-full border-2 border-blue-400 flex items-center justify-center">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">head</div>
                    <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[A]</div>
                    <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[B]</div>
                  </div>
                  <div className="text-center mt-4 text-gray-600 dark:text-gray-300">Existing circular list</div>
                </div>
                <div className="text-center text-gray-600 dark:text-gray-300">↓ Insert X at head ↓</div>
                <div className="relative">
                  <div className="w-64 h-32 rounded-full border-2 border-blue-400 flex items-center justify-center">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">head</div>
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[X]</div>
                    <div className="absolute top-3/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[A]</div>
                    <div className="absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[B]</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deletion Process */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Deletion Process</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {deletionSteps.map((step, index) => (
                  <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                    {step.step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-64 h-32 rounded-full border-2 border-blue-400 flex items-center justify-center">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">head</div>
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[X]</div>
                    <div className="absolute top-3/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[A]</div>
                    <div className="absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[B]</div>
                  </div>
                  <div className="text-center mt-4 text-gray-600 dark:text-gray-300">Current circular list</div>
                </div>
                <div className="text-center text-gray-600 dark:text-gray-300">↓ Delete X (head) ↓</div>
                <div className="relative">
                  <div className="w-64 h-32 rounded-full border-2 border-blue-400 flex items-center justify-center">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">head</div>
                    <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[A]</div>
                    <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">[B]</div>
                  </div>
                </div>
              </div>
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

        {/* Comparison with Linear Linked List */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comparison with Linear Linked List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Linear Linked List</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Circular Linked List</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonTable.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] dark:text-[#d1d5db]">{row.linear}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] dark:text-[#d1d5db]">{row.circular}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pros and Cons */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pros and Cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">Advantages</h3>
              <ul className="space-y-2">
                {prosCons.filter(item => item.type === "pro").map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#374151] dark:text-[#d1d5db]">{item.point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">Limitations</h3>
              <ul className="space-y-2">
                {prosCons.filter(item => item.type === "con").map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-[#374151] dark:text-[#d1d5db]">{item.point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Applications</h2>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-5 marker:text-blue-500 dark:marker:text-blue-400">
              {applications.map((app, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {app}
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>When to Choose:</strong> Prefer circular linked lists when you need continuous cycling through elements or when the application naturally follows a circular pattern (like round-robin scheduling).
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default content;
