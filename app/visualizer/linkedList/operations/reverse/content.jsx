const content = () => {
  const overview = [
    `Reversing a linked list involves changing the direction of the pointers so that the last node becomes the head and the head becomes the last node.`,
    `This operation is fundamental in many algorithms and helps in scenarios where you need to process the list in reverse order without using extra space.`
  ];

  const mergeSteps = [
    { step: "Initialize three pointers: previous as null, current as head, and next as null" },
    { step: "Iterate through the list until current is null" },
    { step: "Store the next node of current in next" },
    { step: "Change the next pointer of current to previous" },
    { step: "Move previous to current and current to next" },
    { step: "After the loop, previous will be the new head of the reversed list" }
  ];

  const edgeCases = [
    "Empty list (head is null)",
    "List with only one node",
    "List with multiple nodes",
    "Handling circular linked lists (should avoid infinite loops)",
    "Ensuring no memory leaks or lost references during reversal"
  ];

  const bestPractices = [
    "Use iterative approach for in-place reversal with O(1) extra space",
    "Consider recursive reversal for cleaner code but with extra stack space",
    "Always check for null pointers to avoid runtime errors",
    "Test edge cases like empty or single-node lists",
    "Avoid modifying node values; only change pointers"
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Reversing a Linked List
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {overview.map((para, index) => (
              <p key={index} className="text-[#374151] dark:text-[#d1d5db] mb-3 leading-relaxed">
                {para}
              </p>
            ))}
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>Tip:</strong> Reversing a linked list is efficient and can be done in-place with O(1) extra space by manipulating pointers carefully.
              </p>
            </div>
          </div>
        </section>

        {/* Merge Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Steps to Reverse</h2>
          <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {mergeSteps.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                {item.step}
              </li>
            ))}
          </ol>
        </section>

        {/* Edge Cases */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edge Cases</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-yellow-500 dark:marker:text-yellow-400">
            {edgeCases.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db]">{item}</li>
            ))}
          </ul>
        </section>

        {/* Best Practices */}
        <section className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Best Practices</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-green-500 dark:marker:text-green-400">
            {bestPractices.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db]">{item}</li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
};

export default content;