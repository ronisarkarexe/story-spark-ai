const content = () => {
  const overview = [
    `A Doubly Linked List is an advanced variation of the linked list where each node contains data and two pointers - one to the next node and another to the previous node. This bidirectional linkage enables traversal in both directions.`,
    `The list maintains head and tail pointers, allowing O(1) operations at both ends. Each node's previous pointer forms the backward chain, while the next pointer forms the forward chain.`,
    `Doubly linked lists are particularly useful when you need frequent backward traversal or operations at both ends of the list, providing more flexibility than singly linked lists at the cost of slightly higher memory overhead.`,
  ];

  const basicOperations = [
    { name: "Insertion at Head", complexity: "O(1)", description: "Add new node at beginning, update head and adjacent node's pointers" },
    { name: "Insertion at Tail", complexity: "O(1)", description: "Add new node at end using tail pointer" },
    { name: "Insertion at Position", complexity: "O(n)", description: "Traverse to position and insert with pointer updates" },
    { name: "Deletion at Head", complexity: "O(1)", description: "Remove first node and update head pointer" },
    { name: "Deletion at Tail", complexity: "O(1)", description: "Remove last node using tail pointer" },
    { name: "Deletion by Value", complexity: "O(n)", description: "Traverse to find node and update adjacent pointers" },
    { name: "Forward Traversal", complexity: "O(n)", description: "Traverse from head to tail using next pointers" },
    { name: "Backward Traversal", complexity: "O(n)", description: "Traverse from tail to head using prev pointers" },
  ];

  const implementationCode = [
    { code: "class DoublyNode {" },
    { code: "  constructor(data) {" },
    { code: "    this.data = data;" },
    { code: "    this.prev = null;" },
    { code: "    this.next = null;" },
    { code: "  }" },
    { code: "}" },
    { code: "" },
    { code: "class DoublyLinkedList {" },
    { code: "  constructor() {" },
    { code: "    this.head = null;" },
    { code: "    this.tail = null;" },
    { code: "    this.size = 0;" },
    { code: "  }" },
    { code: "" },
    { code: "  isEmpty() {" },
    { code: "    return this.head === null;" },
    { code: "  }" },
    { code: "" },
    { code: "  // Insert at head" },
    { code: "  insertFirst(data) {" },
    { code: "    const newNode = new DoublyNode(data);" },
    { code: "    if (this.isEmpty()) {" },
    { code: "      this.head = newNode;" },
    { code: "      this.tail = newNode;" },
    { code: "    } else {" },
    { code: "      newNode.next = this.head;" },
    { code: "      this.head.prev = newNode;" },
    { code: "      this.head = newNode;" },
    { code: "    }" },
    { code: "    this.size++;" },
    { code: "  }" },
  ];

  const insertionSteps = [
    { step: "1. Create new node with data, prev, and next pointers" },
    { step: "2. For head insertion: Set new node's next to current head" },
    { step: "3. Update current head's prev to new node" },
    { step: "4. Move head pointer to new node" },
    { step: "5. For empty list, set both head and tail to new node" },
    { step: "6. For tail insertion: Similar steps but working from tail" },
  ];

  const deletionSteps = [
    { step: "1. Check if list is empty" },
    { step: "2. For head deletion: Store head reference, move head to head.next" },
    { step: "3. Set new head's prev to null (if exists)" },
    { step: "4. For tail deletion: Similar steps working from tail" },
    { step: "5. For middle deletion: Find node, update adjacent nodes' pointers" },
    { step: "6. Handle special cases (single node removal)" },
  ];

  const prosCons = [
    { point: "Bidirectional traversal capability", type: "pro" },
    { point: "O(1) operations at both ends", type: "pro" },
    { point: "Easier node removal (no need to track previous node)", type: "pro" },
    { point: "Better for certain algorithms (e.g., LRU cache)", type: "pro" },
    { point: "Extra memory for prev pointers", type: "con" },
    { point: "More pointer operations (slightly complex implementation)", type: "con" },
    { point: "Slightly slower operations due to extra pointer updates", type: "con" },
  ];

  const visualization = [
    { operation: "Initialization", state: "head → null ← tail" },
    { operation: "insertFirst(10)", state: "head → [null|10|•] ← tail" },
    { operation: "insertFirst(20)", state: "head → [null|20|•] ↔ [•|10|•] ← tail" },
    { operation: "insertLast(30)", state: "head → [null|20|•] ↔ [•|10|•] ↔ [•|30|null] ← tail" },
    { operation: "deleteFirst()", state: "head → [null|10|•] ↔ [•|30|null] ← tail" },
    { operation: "deleteLast()", state: "head → [null|10|null] ← tail" },
  ];

  const applications = [
    "Browser forward/backward navigation",
    "Undo/Redo functionality in software",
    "LRU (Least Recently Used) cache implementation",
    "Navigation systems with bidirectional movement",
    "Music/video playlists with forward/backward controls",
    "Text editors with cursor movement in both directions",
  ];

  const comparisonTable = [
    { feature: "Traversal Direction", singly: "Forward only", doubly: "Both directions" },
    { feature: "Memory Overhead", singly: "Lower (1 pointer/node)", doubly: "Higher (2 pointers/node)" },
    { feature: "Insert/Delete at Head", singly: "O(1)", doubly: "O(1)" },
    { feature: "Insert/Delete at Tail", singly: "O(n) (or O(1) with tail pointer)", doubly: "O(1)" },
    { feature: "Delete Current Node", singly: "Requires previous node", doubly: "Direct access via prev pointer" },
    { feature: "Implementation Complexity", singly: "Simpler", doubly: "More complex" },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview Section */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Doubly Linked List
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {overview.map((para, index) => (
              <p key={index} className="text-[#374151] dark:text-[#d1d5db] mb-3 leading-relaxed">
                {para}
              </p>
            ))}
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>Key Property:</strong> Each node is represented as [prev|data|next], showing the bidirectional links between nodes.
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

        {/* Implementation */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Implementation</h2>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {implementationCode.map((line, index) => (
                  <div key={index}>{line.code}</div>
                ))}
              </code>
            </pre>
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
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <span className="font-mono mr-2">head →</span>
                  <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">[•|A|•] ↔ [•|B|•]</div>
                  <span className="font-mono ml-2">← tail</span>
                </div>
                <div className="text-center text-gray-600 dark:text-gray-300">↓ Insert X at head ↓</div>
                <div className="flex items-center">
                  <span className="font-mono mr-2">head →</span>
                  <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">[null|X|•] ↔ [•|A|•] ↔ [•|B|•]</div>
                  <span className="font-mono ml-2">← tail</span>
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
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <span className="font-mono mr-2">head →</span>
                  <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">[•|X|•] ↔ [•|A|•] ↔ [•|B|•]</div>
                  <span className="font-mono ml-2">← tail</span>
                </div>
                <div className="text-center text-gray-600 dark:text-gray-300">↓ Delete A ↓</div>
                <div className="flex items-center">
                  <span className="font-mono mr-2">head →</span>
                  <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">[•|X|•] ↔ [•|B|•]</div>
                  <span className="font-mono ml-2">← tail</span>
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

        {/* Comparison with Singly Linked List */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comparison with Singly Linked List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Singly Linked List</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Doubly Linked List</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonTable.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] dark:text-[#d1d5db]">{row.singly}</td>
                    <td className="px-4 py-3 text-sm text-[#374151] dark:text-[#d1d5db]">{row.doubly}</td>
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
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-5 marker:text-primary dark:marker:text-[#c27cf7]">
              {applications.map((app, index) => (
                <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {app}
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>When to Choose:</strong> Prefer doubly linked lists when you need bidirectional traversal, frequent operations at both ends, or when the ability to delete arbitrary nodes without traversal is valuable.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default content;