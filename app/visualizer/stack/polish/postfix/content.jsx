"use client";
import { useEffect, useState } from "react";

const Content = () => {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
    };

    updateTheme();
    setMounted(true);

    window.addEventListener("storage", updateTheme);
    window.addEventListener("themeChange", updateTheme);

    return () => {
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("themeChange", updateTheme);
    };
  }, []);

  const paragraph = [
    `Postfix notation (also called Reverse Polish Notation) is a way of writing expressions where the operator comes after the operands.`,
    `For example, the infix expression 3 + 4 becomes 3 4 + in postfix. It removes the need for parentheses by making operator precedence explicit through position.`,
    `Note: Higher precedence means the operation will happen first. When operators have equal precedence, they are evaluated left-to-right (except for exponentiation which is right-to-left).`,
  ];

  const steps = [
    { points : "Initialize an empty stack and an empty output string." },
    { points : "Scan the infix expression from left to right." },
    { points : "If the element is an operand, add it to the output." },
    { points : "If the element is a '(', push it onto the stack." },
    { points : `If the element is a ')', pop from the stack and add to output until '(' is encountered.` },
    { points : "If the element is an operator, pop from the stack all operators with higher or equal precedence, then push the current operator." },
    { points : "After scanning, pop all remaining operators from the stack." },
  ];

  const example = [
    { points : "Infix: (A + B) * (C - D)" },
    { points : `Step 1: Push '(' → Stack: [ '(' ], Output: ''` },
    { points : "Step 2: Add 'A' → Output: 'A'" },
    { points : "Step 3: Push '+' → Stack: [ '(', '+' ]" },
    { points : "Step 4: Add 'B' → Output: 'A B'" },
    { points : "Step 5: Pop until '(' → Stack: [ ], Output: 'A B +'" },
    { points : "Step 6: Continue similarly for the rest → Final Postfix: A B + C D - *" },
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        {/* What is Postfix Notation? */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Postfix Notation?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {paragraph.map((text, idx) => (
              <p
                key={idx}
                className="text-[#374151] dark:text-[#d1d5db] mb-4 leading-relaxed"
              >
                {text}
              </p>
            ))}
          </div>
        </section>

        {/* Infix to Postfix Conversion Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Infix to Postfix Conversion Steps
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {steps.map((item, idx) => (
                <li key={idx} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                  {item.points}
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <span className="font-medium">
                Example:
              </span>
              <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                {example.map((item, idx) => (
                  <li key={idx} className="text-[#6b7280] dark:text-[#9ca3af]">
                    {item.points}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Operator Precedence Table */}
        <section className="p-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Operator Precedence Table
          </h1>
          <div className="prose dark:prose-invert max-w-none overflow-x-auto">
            <table className="min-w-full border-collapse border border-blue-700">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/20">
                  <th className="border border-blue-700 px-4 py-2 font-semibold">
                    Operator
                  </th>
                  <th className="border border-blue-700 px-4 py-2 font-semibold">
                    Meaning
                  </th>
                  <th className="border border-blue-700 px-4 py-2 font-semibold">
                    Precedence
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    ( )
                  </td>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Parentheses
                  </td>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Highest
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/20">
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    ^ %
                  </td>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Exponentiation / Modulus
                  </td>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    2
                  </td>
                </tr>
                <tr>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    * /
                  </td>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Multiplication / Division
                  </td>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    3
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/20">
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    + -
                  </td>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Addition / Subtraction
                  </td>
                  <td className="border border-blue-700 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    4 (Lowest)
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-[#374151] dark:text-[#d1d5db] mt-4 leading-relaxed">
              {paragraph[2]}
            </p>
          </div>
        </section>
      </article>
</main>
  );
  };
  
  export default Content;
