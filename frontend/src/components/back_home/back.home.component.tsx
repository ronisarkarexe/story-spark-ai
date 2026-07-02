import { ArrowLeft } from "lucide-react";
const BackHomeComponent = () => {
  return (
    <div className="bg-gradient-to-r from-slate-800 via-blue-500/10 to-slate-800 rounded-lg p-2 hover:from-slate-800 hover:via-blue-500/30 hover:to-slate-800 transition text-blue-600">
      <ArrowLeft size={16} className="inline mr-1" /> Back
    </div>
  );
};

export default BackHomeComponent;
