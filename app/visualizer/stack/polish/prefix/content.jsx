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
    `Prefix notation (also called Polish Notation) is a way of writing expressions where the operator comes before the operands.`,
    `For example, the infix expression 3 + 4 becomes + 3 4 in prefix. It removes the need for parentheses by using operator order directly.`,
    `Note: Higher precedence means the operation will happen first. Exponentiation (^) is evaluated right-to-left, while others are left-to-right.`,
  ];

  const steps = [
    { points : "Reverse the infix expression, while keeping the positions of parentheses correct." },
    { points : "Replace ( with ) and vice-versa." },
    { points : "Convert the reversed expression to postfix using a stack." },
    { points : "Finally, reverse the postfix expression to get the prefix expression." },
  ];

  const example = [
    { points : "Infix: (A + B) * (C - D)" },
    { points : "Step 1: Reverse → (D - C) * (B + A)" },
    { points : "Step 2: Convert to postfix → D C - B A + *" },
    { points : "Step 3: Reverse → * + A B - C D" },
  ];

  return (
    <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 md:gap-4">
      <div className="col-span-1">
        <div className="hidden md:block">
          {mounted && (
            <iframe
              key={theme}
              src={
                theme === "dark"
                  ? "https://hw.glich.co/resources/embed/daily/dsa?theme=dark"
                  : "https://hw.glich.co/resources/embed/daily/dsa?theme=light"
              }
              width="100%"
              height="400"
              title="Daily DSA Challenge"
            ></iframe>
          )}
        </div>
        <div className="flex justify-center">
          <span className="text-xs hidden md:block">
            Daily DSA Challenge by{" "}
            <a
              href="https://hw.glich.co/resources/daily"
              target="_blank"
              className="underline hover:text-blue-500 duration-300"
            >
              Hello World
            </a>
          </span>
        </div>
      </div>
      <article className="col-span-4 max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        {/* What is Prefix Notation? */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Prefix Notation?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              {paragraph[0]}
            </p>
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed mt-4">
              {paragraph[1]}
            </p>
          </div>
        </section>

        {/* Infix to Prefix Conversion Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Infix to Prefix Conversion Steps
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-3 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {steps.map((item, index) => (
                <li
                  key={index}
                  className="text-[#374151] dark:text-[#d1d5db] pl-2"
                >
                  {item.points}
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <span className="font-medium dark:text-amber-500 text-purple-600">
                Example:
              </span>
              <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-400 dark:marker:text-gray-500">
                {example.map((item, index) => (
                  <li key={index} className="text-[#6b7280] dark:text-[#9ca3af]">
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
            <table className="min-w-full border-collapse border border-blue-500">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/20">
                  <th className="border border-blue-500 px-4 py-2 font-semibold">
                    Operator
                  </th>
                  <th className="border border-blue-500 px-4 py-2 font-semibold">
                    Meaning
                  </th>
                  <th className="border border-blue-500 px-4 py-2 font-semibold">
                    Precedence
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    ( )
                  </td>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Parentheses
                  </td>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Highest
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/20">
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    ^ %
                  </td>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Exponentiation / Modulus
                  </td>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    2
                  </td>
                </tr>
                <tr>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    * /
                  </td>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Multiplication / Division
                  </td>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    3
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/20">
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    + -
                  </td>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
                    Addition / Subtraction
                  </td>
                  <td className="border border-blue-500 px-4 py-2 text-[#374151] dark:text-[#d1d5db]">
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

      {/* Mobile iframe at bottom */}
      <div className="block md:hidden w-full">
        {mounted && (
          <iframe
            key={theme}
            src={
              theme === "dark"
                ? "https://hw.glich.co/resources/embed/daily/dsa?theme=dark"
                : "https://hw.glich.co/resources/embed/daily/dsa?theme=light"
            }
            width="100%"
            height="320"
            title="Daily DSA Challenge"
          ></iframe>
        )}
        <div className="flex justify-center pb-8">
          <span className="text-xs">
            Daily DSA Challenge by{" "}
            <a
              href="https://hw.glich.co/resources/daily"
              target="_blank"
              className="underline hover:text-blue-500 duration-300"
            >
              Hello World
            </a>
          </span>
        </div>
      </div>
    </main>
  );
};

export default Content;
