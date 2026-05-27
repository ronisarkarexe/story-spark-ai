const content = () => {
  const overview = [
    `A Singly Linked List is a linear data structure where each element (node) contains data and a pointer to the next node. Unlike arrays, linked lists don't have fixed sizes and allow efficient insertion/deletion at any position.`,
    `The list maintains a head pointer that points to the first node. The last node's next pointer is null, indicating the end of the list. This structure provides O(1) insertion/deletion at the head but O(n) access time for arbitrary elements.`,
    `Singly linked lists are fundamental building blocks for more complex data structures like stacks, queues, and adjacency lists for graphs.`,
  ];

  const basicOperations = [
    { name: "Insertion at Head", complexity: "O(1)", description: "Add new node at beginning by updating head pointer" },
    { name: "Insertion at Tail", complexity: "O(n)", description: "Traverse to end and add new node (O(1) with tail pointer)" },
    { name: "Deletion at Head", complexity: "O(1)", description: "Remove first node by updating head pointer" },
    { name: "Deletion by Value", complexity: "O(n)", description: "Traverse list to find and remove specific node" },
    { name: "Search", complexity: "O(n)", description: "Traverse list to find element" },
    { name: "Access by Index", complexity: "O(n)", description: "Traverse list until reaching desired position" },
  ];

  const implementationCode = [
    { code: "class Node {" },
    { code: "  constructor(data) {" },
    { code: "    this.data = data;" },
    { code: "    this.next = null;" },
    { code: "  }" },
    { code: "}" },
    { code: "" },
    { code: "class SinglyLinkedList {" },
    { code: "  constructor() {" },
    { code: "    this.head = null;" },
    { code: "    this.size = 0;" },
    { code: "  }" },
    { code: "" },
    { code: "  // Check if list is empty" },
    { code: "  isEmpty() {" },
    { code: "    return this.head === null;" },
    { code: "  }" },
    { code: "" },
    { code: "  // Insert at head" },
    { code: "  insertFirst(data) {" },
    { code: "    const newNode = new Node(data);" },
    { code: "    newNode.next = this.head;" },
    { code: "    this.head = newNode;" },
    { code: "    this.size++;" },
    { code: "  }" },
  ];

  const insertionAtHeadSteps = [
    { step: "1. Create new node with given data" },
    { step: "2. Set new node's next to current head" },
    { step: "3. Update head pointer to new node" },
    { step: "4. Increment list size counter" },
  ];

  const deletionSteps = [
    { step: "1. Check if list is empty (head === null)" },
    { step: "2. If deleting head, update head to head.next" },
    { step: "3. For middle deletion, find previous node and update its next pointer" },
    { step: "4. Decrement list size counter" },
    { step: "5. Return deleted data (if needed)" },
  ];

  const prosCons = [
    { point: "Dynamic size - grows as needed", type: "pro" },
    { point: "Efficient insertion/deletion at head", type: "pro" },
    { point: "No memory waste (only allocates needed nodes)", type: "pro" },
    { point: "No random access - must traverse from head", type: "con" },
    { point: "Extra memory for next pointers", type: "con" },
    { point: "Not cache-friendly (nodes scattered in memory)", type: "con" },
  ];

  const visualization = [
    { operation: "Initialization", state: "head → null" },
    { operation: "insertFirst(10)", state: "head → [10|•] → null" },
    { operation: "insertFirst(20)", state: "head → [20|•] → [10|•] → null" },
    { operation: "insertLast(30)", state: "head → [20|•] → [10|•] → [30|•] → null" },
    { operation: "deleteFirst()", state: "head → [10|•] → [30|•] → null" },
    { operation: "delete(30)", state: "head → [10|•] → null" },
  ];

  const applications = [
    "Implementing stacks and queues",
    "Memory management systems",
    "Undo functionality in software",
    "Hash table collision handling",
    "Polynomial representation and arithmetic",
    "Browser history navigation",
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview Section */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Singly Linked List
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {overview.map((para, index) => (
              <p key={index} className="text-[#374151] dark:text-[#d1d5db] mb-3 leading-relaxed">
                {para}
              </p>
            ))}
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>Key Property:</strong> Each node contains data and a single pointer to the next node, forming a unidirectional chain.
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Complexity</th>
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

        {/* Insertion at Head */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Insertion at Head</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
                {insertionAtHeadSteps.map((step, index) => (
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
                  <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">[A|•] → [B|•] → null</div>
                </div>
                <div className="text-center text-gray-600 dark:text-gray-300">↓ Insert X at head ↓</div>
                <div className="flex items-center">
                  <span className="font-mono mr-2">head →</span>
                  <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">[X|•] → [A|•] → [B|•] → null</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deletion */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Deletion Operations</h2>
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
                  <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">[X|•] → [A|•] → [B|•] → null</div>
                </div>
                <div className="text-center text-gray-600 dark:text-gray-300">↓ Delete A ↓</div>
                <div className="flex items-center">
                  <span className="font-mono mr-2">head →</span>
                  <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">[X|•] → [B|•] → null</div>
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
                <strong>Note:</strong> Singly linked lists are preferred when you need constant-time insertions/deletions at the beginning and don&apos;t require backward traversal.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default content;
