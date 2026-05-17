import React from "react";
import aiWriter from "../../../assets/aiwriter.webp";
import { Link } from "react-router-dom";

const StartWritingComponent = () => {
  return (
    <section className="mb-16 mx-5">
      <div className="premium-card rounded-[2rem] overflow-hidden border border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:px-10 lg:px-12 grid gap-10 md:grid-cols-[1.3fr_0.9fr] items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-3 rounded-full bg-indigo-500/15 px-4 py-2 text-sm text-indigo-100">
              <i className="fas fa-rocket" /> Launch your storytelling journey
            </p>
            <h2 className="text-4xl font-bold text-white">
              Ready to start writing today?
            </h2>
            <p className="text-slate-300 text-lg leading-8 max-w-xl">
              Join thousands of writers who are already creating amazing content with our AI-powered platform.
            </p>
            <Link to="/stories">
              <button className="button-primary rounded-full px-8 py-3 text-base font-semibold">
                Get Started Free
              </button>
            </Link>
          </div>
          <div className="flex justify-center">
            <img
              src={aiWriter}
              alt="Writing Illustration"
              className="w-full max-w-lg rounded-[1.5rem] border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartWritingComponent;
