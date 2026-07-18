import React from "react";
import { Link } from "react-router-dom";
type Props = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const AuthLayout = ({ children, title, subtitle }: Props) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Branding Section */}
      <div className="bg-slate-100 dark:bg-zinc-800 flex w-full md:w-[35%] flex-col justify-center gap-6 md:gap-8 p-6 md:p-8 md:min-h-screen border-b md:border-b-0 md:border-r border-slate-200 dark:border-zinc-700 transition-colors duration-300">
        <Link to="/" className="flex items-center gap-3">
          <img loading="lazy" src="/apple-touch-icon.png" alt="StorySparkAI Logo" className="h-8 w-auto object-contain" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-300 to-blue-400">
            StorySparkAI
          </h1>
        </Link>

        <div>
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-gray-100 font-bold">{title}</h1>

          <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="bg-white dark:bg-black flex flex-1 items-center justify-center p-6 md:p-8 transition-colors duration-300">
        <div className="w-full max-w-md py-4 md:py-0">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
