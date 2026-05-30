import { FC } from "react";

interface TroubleshootItem {
  id?: string;
  title: string;
  symptoms: string;
  solution: string;
}

interface TroubleshootProps {
  items: TroubleshootItem[];
}

// Assuming TroubleshootCard is imported elsewhere or handled by the user. 
// If it needs to be imported, the user can add it. I'm just fixing the JSX.
declare const TroubleshootCard: any;

const Troubleshoot: FC<TroubleshootProps> = ({ items }) => {
  return (
    <section id="troubleshoot-section" className="scroll-mt-28 transition-colors duration-300">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 mb-4">
          <i className="fa-solid fa-screwdriver-wrench"></i>
          <span className="text-sm font-semibold">TROUBLESHOOTING GUIDE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Fix Common Problems
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Diagnose and resolve common StorySparkAI issues quickly with guided
          troubleshooting steps and recommended fixes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <TroubleshootCard key={item.id || index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Troubleshoot;