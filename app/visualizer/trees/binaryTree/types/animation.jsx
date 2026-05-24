"use client";
import Footer from "@/app/components/footer";
import ExploreOther from "@/app/components/ui/exploreOther";
import Content from "@/app/visualizer/trees/binaryTree/types/content";
import CodeBlock from "@/app/visualizer/trees/binaryTree/types/codeBlock";
import GoBackButton from "@/app/components/ui/goback";
import BackToTop from "@/app/components/ui/backtotop";

const InfixToPostfixVisualizer = () => {
  return (
    <div className="min-h-screen max-h-auto bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-gray-200">
        <main className="container mx-auto px-6 pt-16 pb-4">

          { /* go back block here */}
          <div className="mt-10 sm:mt-10">
            <GoBackButton />
          </div>

          { /* main logic here */}
          <h1 className="text-4xl md:text-4xl mt-6 ml-10 font-bold text-left text-gray-900 dark:text-white mb-0">
            <span className="text-black dark:text-white">Types of Binary Trees</span>
          </h1>
          <div className='bg-black border border-none dark:bg-gray-600 w-100 h-[2px] rounded-xl mt-2 mb-5'></div>
          <Content />
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8"></p>
        <CodeBlock />
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Structure & Properties", url: "/visualizer/trees/binaryTree/properties" }]}
        />
      </main>
      <div className="bg-gray-700 z-10 h-[1px]"></div>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default InfixToPostfixVisualizer;
