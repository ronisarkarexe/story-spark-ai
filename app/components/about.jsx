import React from "react";
import { IoMdInformationCircle } from "react-icons/io";

const AboutSection = () => {
  return (
    <section className="relative py-10 bg-udemy-bg dark:bg-udemy-dark-bg overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="flex items-center justify-center gap-2 text-udemy-purple dark:text-udemy-purple-light text-sm font-bold tracking-wider uppercase mb-4">
            <IoMdInformationCircle className="text-xl" />
            About The Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-6">
            Revolutionizing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-udemy-purple to-udemy-purple-dark dark:from-udemy-purple-light dark:to-udemy-purple">
              DSA Learning
            </span>
          </h2>
        </div>

        {/* Mission Statement */}
        <div className="max-w-6xl mx-auto bg-white dark:bg-udemy-dark-surface backdrop-blur-sm border border-udemy-border dark:border-udemy-dark-border rounded-2xl p-8 md:p-10 shadow-lg overflow-hidden">
          <div className="relative">
            {/* Decorative element */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-udemy-purple/10 rounded-full filter blur-xl"></div>

            <h3 className="text-2xl md:text-3xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-6 relative">
              <span className="text-udemy-purple">Our</span> Mission
            </h3>
            <div className="space-y-6 text-lg text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
              <p>
                AlgoBuddy was created to bridge the gap between theoretical
                knowledge and practical understanding. We believe that seeing
                concepts in action is the key to mastering data structures and
                algorithms.
              </p>
              <p>
                Whether you're a student preparing for exams, a developer honing
                your skills, or an enthusiast exploring computer science, our
                tool makes learning engaging and effective through interactive
                visualizations and a user-friendly interface.
              </p>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="mt-20 mx-auto h-[1px] max-w-4xl bg-gradient-to-r rounded-sm from-transparent via-udemy-purple/20 dark:via-udemy-purple/30 to-transparent"></div>
      </div>
    </section>
  );
};

export default AboutSection;
