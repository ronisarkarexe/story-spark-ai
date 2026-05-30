import { Link } from "react-router-dom";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 px-6 py-12 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      
      <div className="max-w-4xl mx-auto text-center">
        
        <h1 className="text-4xl font-bold mb-6">
          Help Center
        </h1>

        <p className="text-lg text-slate-700 leading-8 dark:text-gray-300">
          Need assistance? Find answers and support for using StorySparkAI.
        </p>

        <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-md dark:bg-zinc-900 dark:border-zinc-800">
          
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Support Topics
          </h2>

          <ul className="space-y-3 text-slate-700 dark:text-gray-300">
            
            <li className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
              Account setup
            </li>

            <li className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
              Story generation help
            </li>

            <li className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
              Contribution guidance
            </li>

          </ul>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-full shadow-md hover:bg-blue-600 transition"
          >
            ⬅ Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;