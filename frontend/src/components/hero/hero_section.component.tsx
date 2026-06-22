import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import NavListComponent from "./nav_list.component";

const HeroSectionComponent = () => {
  return (
    <div className="gradient-bg min-h-screen flex flex-col">
      <div className="relative overflow-hidden flex-grow">
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-14 pb-24 text-center">
          <div className="inline-flex items-center justify-center mx-auto px-4 py-1.5 mb-8 rounded-full bg-opacity-10 border border-white/20 opacity-80 bg-blue-500/20 text-white">
            <span className="text-sm font-medium">
              NEW TEXT TO STORY GENERATION
            </span>
            <span className="ml-2 text-sm font-semibold">
              {" "}
              AI <i className="fa-solid fa-wand-sparkles"></i>
            </span>
          </div>
          <h1 className="mx-auto max-w-5xl text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-500 to-slate-900 mb-8 tracking-tight leading-tight">
            Unleash Your
            <br />
            Imagination with AI-Generated Stories!
            <span className="inline-block ml-4 align-middle">
              <i className="fas fa-bolt text-yellow-400 glow"></i>
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Transform your ideas into captivating narratives with just a simple
            prompt. Whether it's fantasy, mystery, or sci-fi — let your
            creativity flow effortlessly.
          </p>

          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="relative max-w-3xl w-full before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-purple-500/20 before:via-indigo-500/20 before:to-blue-500/20 before:blur-xl before:animate-pulse">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-sparkles text-gray-400"></i>
                </div>
                <Link to="/stories">
                  <button className="relative !rounded-button bg-gradient-to-ber from-blue-900 via-emerald-800 to-blue-500 text-white font-medium px-6 py-2 mr-2 border border-white/20 transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500 before:via-blue-900 before:to-emerald-800 before:animate-border-gradient before:rounded-xl before:-z-10 before:blur-sm cursor-pointer">
                    <i className="fa fa-wand-magic-sparkles mr-2"></i>Get
                    Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-custom/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        {/* <div className="absolute top-[-200px] right-[100px] w-[500px] h-[400px] bg-pink-500/20 rounded-full blur-3xl -z-10"></div> */}
      </div>

    </div>
  );
};

export default HeroSectionComponent;
