const content = () => {
  const overview = [
    `Comparing two linked lists involves checking whether both lists contain the same sequence of values in the same order.`,
    `This is typically done using a pointer approach where we traverse both lists simultaneously and compare values at each corresponding node.`
  ];

  const mergeSteps = [
    { step: "Start from the head node of both linked lists" },
    { step: "Iterate through both lists simultaneously" },
    { step: "At each step, compare the values of the current nodes" },
    { step: "If values differ or one list ends before the other, the lists are not the same" },
    { step: "If both lists end together without mismatches, they are considered equal" }
  ];

  const edgeCases = [
    "Both lists are empty",
    "One list is empty",
    "Lists have different lengths",
    "Lists have same length but different values",
    "Lists are exactly the same"
  ];

  const bestPractices = [
    "Ensure both lists are of similar structure before comparing",
    "Traverse both lists node by node to avoid missing mismatches",
    "Use dummy data to test all edge cases including empty and unequal lists",
    "If lists contain objects, consider deep comparison of values",
    "Track index or pointer position for debugging mismatches"
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Comparing Two Linked Lists
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Steps to Compare</h2>
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