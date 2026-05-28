import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSubmitBugReportMutation } from "../../redux/apis/bugReport.api";
import { 
  Bug, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Mail, 
  Layers, 
  Activity, 
  MessageSquare,
  ClipboardList,
  Target,
  FileWarning
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReportBugFormData {
  title: string;
  category: string;
  severity: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  email?: string;
}

const CATEGORIES = [
  "UI/UX",
  "Story Generation",
  "Authentication",
  "Performance",
  "Dashboard",
  "Other"
];

const SEVERITIES = [
  "Low",
  "Medium",
  "High",
  "Critical"
];

const ReportBug = () => {
  const [submitBugReport, { isLoading: isSubmitting }] = useSubmitBugReportMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReportBugFormData>();

  const onSubmit = async (data: ReportBugFormData) => {
    try {
      await submitBugReport(data).unwrap();
      
      setIsSuccess(true);
      toast.success("Bug report submitted successfully!");
      reset();
      
      // Scroll to top of form or success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error("Failed to submit report. Please try again.");
    }
  };

  return (
    <section className="min-h-screen px-4 py-16 relative flex flex-col items-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300 sm:px-6 md:px-10 lg:px-20">
        {/* Background Decorative Glows */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 blur-[130px] rounded-full" />
        
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="relative z-10 w-full max-w-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 text-center shadow-2xl my-auto"
              role="alert"
              aria-labelledby="success-title"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 id="success-title" className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Report Submitted!</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
                Thank you for helping us make StorySparkAI better. Our team will review your report and take action as soon as possible.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-105"
              >
                Submit Another Report
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl relative z-10"
            >
              {/* Hero Section */}
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
                    <Bug className="w-4 h-4" />
                    <span>Bug Tracker</span>
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                    Report a <span className="text-blue-600 dark:text-blue-400">Bug</span>
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                    Help us improve StorySparkAI by reporting issues in a structured way. 
                    Detailed reports help us fix things faster.
                  </p>
                  <div className="w-24 h-1.5 bg-blue-500 mx-auto mt-8 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </motion.div>
              </div>

              {/* Form Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
                
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-2xl space-y-8"
                  aria-label="Report a Bug form"
                >
                  {/* Section 1: Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="title" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                        Bug Title <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                          <FileWarning className="w-5 h-5" />
                        </div>
                        <input
                          id="title"
                          {...register("title", { required: "Bug title is required" })}
                          placeholder="Summarize the issue in a few words"
                          className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.title ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 font-medium`}
                        />
                      </div>
                      {errors.title && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                          <AlertCircle className="w-4 h-4" /> {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                        Bug Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                          <Layers className="w-5 h-5" />
                        </div>
                        <select
                          id="category"
                          {...register("category", { required: "Please select a category" })}
                          className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.category ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-10 py-4 text-slate-900 dark:text-white appearance-none outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 font-medium cursor-pointer`}
                        >
                          <option value="" className="dark:bg-slate-900">Select category</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                          <AlertCircle className="w-4 h-4" /> {errors.category.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="severity" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                        Severity / Priority <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                          <Activity className="w-5 h-5" />
                        </div>
                        <select
                          id="severity"
                          {...register("severity", { required: "Please select severity" })}
                          className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.severity ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-10 py-4 text-slate-900 dark:text-white appearance-none outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 font-medium cursor-pointer`}
                        >
                          <option value="" className="dark:bg-slate-900">Select severity</option>
                          {SEVERITIES.map(sev => (
                            <option key={sev} value={sev} className="dark:bg-slate-900">{sev}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      {errors.severity && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                          <AlertCircle className="w-4 h-4" /> {errors.severity.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Details */}
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="description" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute top-5 left-5 pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <textarea
                          id="description"
                          {...register("description", { required: "Description is required" })}
                          rows={4}
                          placeholder="Briefly describe what's happening"
                          className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.description ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 resize-none font-medium`}
                        />
                      </div>
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                          <AlertCircle className="w-4 h-4" /> {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="steps" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                        Steps to Reproduce <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute top-5 left-5 pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                          <ClipboardList className="w-5 h-5" />
                        </div>
                        <textarea
                          id="steps"
                          {...register("steps", { required: "Steps to reproduce are required" })}
                          rows={4}
                          placeholder="1. Go to... &#10;2. Click on... &#10;3. See error..."
                          className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.steps ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 resize-none font-medium`}
                        />
                      </div>
                      {errors.steps && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                          <AlertCircle className="w-4 h-4" /> {errors.steps.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="expected" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                          Expected Behavior <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group/input">
                          <div className="absolute top-5 left-5 pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                            <Target className="w-5 h-5" />
                          </div>
                          <textarea
                            id="expected"
                            {...register("expected", { required: "Expected behavior is required" })}
                            rows={3}
                            placeholder="What should have happened?"
                            className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.expected ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 resize-none font-medium`}
                          />
                        </div>
                        {errors.expected && (
                          <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                            <AlertCircle className="w-4 h-4" /> {errors.expected.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="actual" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                          Actual Behavior <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group/input">
                          <div className="absolute top-5 left-5 pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                            <Info className="w-5 h-5" />
                          </div>
                          <textarea
                            id="actual"
                            {...register("actual", { required: "Actual behavior is required" })}
                            rows={3}
                            placeholder="What actually happened?"
                            className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.actual ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 resize-none font-medium`}
                          />
                        </div>
                        {errors.actual && (
                          <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                            <AlertCircle className="w-4 h-4" /> {errors.actual.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Optional Info */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                      Contact Email (Optional)
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="email"
                        {...register("email", { 
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        type="email"
                        placeholder="your@email.com"
                        className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 font-medium`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                        <AlertCircle className="w-4 h-4" /> {errors.email.message}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 ml-1">
                      Provide your email if you'd like us to reach out for more details or updates on the fix.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-5 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white font-bold text-lg transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting Report...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            <span>Submit Bug Report</span>
                          </>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        {!isSuccess && (
          <div className="w-full max-w-4xl relative z-10 mt-12 mb-12 flex flex-col items-center">
            <div className="p-6 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4 max-w-2xl">
              <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                By submitting this report, you agree that the details provided can be used by StorySparkAI's development team to improve the platform.
              </p>
            </div>
          </div>
        )}
      </section>
  );
};

export default ReportBug;
