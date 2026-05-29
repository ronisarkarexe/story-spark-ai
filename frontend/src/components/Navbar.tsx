import React from "react";
import InstallPwaButton from "./InstallPwaButton"; // Adjust path if necessary

const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left Side: Brand/Logo */}
      <div className="flex items-center">
        <h1 className="text-white font-bold text-lg tracking-tight">
          Story Spark AI
        </h1>
      </div>

      {/* Right Side: Utilities & Profile */}
      <div className="flex items-center gap-4">
        {/* === ADD THE INSTALL BUTTON HERE === */}
        <InstallPwaButton />
        {/* =================================== */}

        {/* Example existing Notification Bell */}
        <button className="text-slate-300 hover:text-white transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* Example existing Profile Icon */}
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold cursor-pointer">
          R
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
