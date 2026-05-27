"use client";
import { Network, Terminal, Code2, Lightbulb } from "lucide-react";

const SyntaxTreesContent = () => {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-lg shadow-purple-500/5">
        
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            What are Syntax Trees?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              An Abstract Syntax Tree (AST), or just Syntax Tree, is a tree representation of the abstract syntactic structure of source code written in a programming language. Each node of the tree denotes a construct occurring in the source code.
            </p>
            <p>
              ASTs are widely used in compilers to check code for accuracy (syntax analysis) and to convert the code into machine language or intermediate code (code generation). They are &quot;abstract&quot; because they do not represent every detail appearing in the real syntax, but rather just the structural or content-related details.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] bg-purple-50/30 dark:bg-purple-900/5">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            Visual Example
          </h2>
          <div className="flex justify-center my-6">
            <svg width="400" height="250" viewBox="0 0 400 250" className="drop-shadow-lg">
              <line x1="200" y1="50" x2="100" y2="120" stroke="#475569" strokeWidth="2" />
              <line x1="200" y1="50" x2="300" y2="120" stroke="#475569" strokeWidth="2" />
              <line x1="300" y1="120" x2="250" y2="190" stroke="#475569" strokeWidth="2" />
              <line x1="300" y1="120" x2="350" y2="190" stroke="#475569" strokeWidth="2" />

              <circle cx="200" cy="50" r="24" fill="#4c1d95" stroke="#a855f7" strokeWidth="3" />
              <text x="200" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">+</text>
              
              <circle cx="100" cy="120" r="24" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <text x="100" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">3</text>
              
              <circle cx="300" cy="120" r="24" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
              <text x="300" y="125" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">*</text>
              
              <circle cx="250" cy="190" r="24" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
              <text x="250" y="195" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">5</text>
              
              <circle cx="350" cy="190" r="24" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
              <text x="350" y="195" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">2</text>
            </svg>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            An Abstract Syntax Tree for the expression: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">3 + (5 * 2)</code>
          </p>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            How It Works in Compilers
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] space-y-4 leading-relaxed">
            <div className="mt-6 grid gap-4">
              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">1. Lexical Analysis</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Source code is converted into a stream of tokens. For example, <code>3 + 5</code> becomes tokens: <code>NUMBER(3)</code>, <code>PLUS</code>, <code>NUMBER(5)</code>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">2. Syntax Analysis (Parsing)</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      The parser takes the tokens and arranges them into an Abstract Syntax Tree based on the rules of the programming language&apos;s grammar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative p-5 rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/60 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shadow-sm group-hover:scale-110 transition-transform">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-[#1a1a1a] dark:text-white">3. Evaluation or Compilation</p>
                    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      The AST is traversed (usually post-order) to evaluate the result (in interpreters) or generate target machine code (in compilers).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-6 border-t border-[#f3f4f6] dark:border-[#1e1e1e] bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/20 dark:to-neutral-950">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-purple-100 dark:bg-purple-900/50 p-2.5 rounded-xl shadow-sm text-purple-600 dark:text-purple-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                Key Takeaways
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-purple-800 dark:text-purple-200/80 leading-relaxed">
                <li>Operator precedence is naturally enforced by the structure of the AST (operators lower in the tree are evaluated first).</li>
                <li>ASTs strip away syntax details like parentheses, semi-colons, and whitespace that aren&apos;t strictly necessary for execution.</li>
              </ul>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default SyntaxTreesContent;
