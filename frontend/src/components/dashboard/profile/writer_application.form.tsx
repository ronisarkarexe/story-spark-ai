import React, { useState } from "react";
import { useSubmitWriterApplicationMutation } from "../../../redux/apis/writer_application.api";
import { User } from "../../../models/user";
import toast from "react-hot-toast";

interface Props {
  user: User;
}

export const WriterApplicationForm = ({ user }: Props) => {
  const [submitApplication, { isLoading }] = useSubmitWriterApplicationMutation();
  const [formData, setFormData] = useState({
    portfolioLink: "",
    reason: "",
  });

  if (user.role === "writer" || user.role === "admin" || user.role === "super_admin") {
    return null;
  }

  if (user.isApplyForWriter) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/50 rounded-xl shadow-lg p-6 md:p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 mb-4">
            <i className="fas fa-clock text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Application Under Review</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            You have already submitted an application for writer access. Our team is currently reviewing it. You will be notified once a decision is made.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitApplication(formData).unwrap();
      toast.success("Application submitted successfully!");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to submit application");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-slate-50 border border-slate-200 dark:bg-white/[0.02] dark:border-white/[0.06] rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-pen-nib"></i>
            Apply for Writer Access
          </h2>
          <p className="text-indigo-200 mt-1 text-sm">
            Join our community of creators. Share your stories with the world.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="portfolioLink" className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1">
                  Portfolio / Website URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  id="portfolioLink"
                  name="portfolioLink"
                  required
                  value={formData.portfolioLink}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-2 border border-slate-350 rounded-lg bg-white text-slate-800 dark:bg-slate-900/70 dark:text-gray-100 dark:border-slate-700/50 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1">
                  Why do you want to write for StorySpark AI? <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  required
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Tell us about your background and what kind of stories you want to share..."
                  className="w-full px-4 py-2 border border-slate-350 rounded-lg bg-white text-slate-800 dark:bg-slate-900/70 dark:text-gray-100 dark:border-slate-700/50 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
