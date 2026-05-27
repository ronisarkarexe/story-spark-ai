const content = () => {
  const overview = [
    `Merging two linked lists involves combining the nodes of both lists into one sorted list. This is typically done using a two-pointer approach where we repeatedly compare the heads of both lists and append the smaller node to the result.`,
    `This operation is especially useful when both input lists are already sorted. The result is also a sorted list without requiring additional sorting operations.`
  ];

  const mergeSteps = [
    { step: "Create a dummy node to act as the starting point of the merged list" },
    { step: "Use a pointer (current) to track the last node in the merged list" },
    { step: "While both lists are non-empty, compare the current nodes" },
    { step: "Attach the smaller node to the merged list and move that list's pointer forward" },
    { step: "Once one list is exhausted, link the remaining part of the other list to the merged list" },
    { step: "Return the node next to dummy as the head of the merged list" }
  ];

  const edgeCases = [
    "Both lists are empty",
    "One list is empty",
    "All nodes in one list are smaller than the other",
    "Lists have overlapping values",
    "Input lists are not sorted (may result in unsorted merged list)"
  ];

  const bestPractices = [
    "Ensure both input lists are sorted before merging",
    "Always use a dummy node to simplify edge case handling",
    "Track edge conditions where one list might be empty",
    "Avoid modifying original input lists if immutability is required",
    "Consider recursive merging for a concise approach (at the cost of stack space)"
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Merging Two Linked Lists
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {overview.map((para, index) => (
              <p key={index} className="text-[#374151] dark:text-[#d1d5db] mb-3 leading-relaxed">
                {para}
              </p>
            ))}
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>Tip:</strong> Merging is efficient when input lists are already sorted and doesn’t require extra space beyond a few pointers.
              </p>
            </div>
          </div>
        </section>

        {/* Merge Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Steps to Merge</h2>
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