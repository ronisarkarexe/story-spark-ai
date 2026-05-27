import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import DryRunClient from "./DryRunClient";

export const metadata = {
  title: "Code Dry Run Visualizer | AlgoBuddy",
  description:
    "Paste code and inspect a safe step-by-step dry run with line highlighting, variables, console output, and data-structure snapshots.",
  keywords: [
    "code dry run",
    "algorithm debugger",
    "DSA visualizer",
    "step by step code execution",
    "custom code visualizer",
  ],
};

export default function DryRunPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#101216] dark:text-slate-100">
      <Navbar />
      <DryRunClient />
      <Footer />
    </div>
  );
}
