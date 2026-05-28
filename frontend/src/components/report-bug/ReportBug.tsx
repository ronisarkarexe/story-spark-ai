import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  Bug, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Mail, 
                  {/* Section 1: Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Your Name</label>
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          id="name"
                          {...register("name")}
                          placeholder="Your name (optional)"
                          className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 font-medium`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Contact Email (optional)</label>
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          id="email"
                          {...register("email", {
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          type="email"
                          placeholder="you@email.com"
                          className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 font-medium`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                          <AlertCircle className="w-4 h-4" /> {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject & Type */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Subject <span className="text-red-500">*</span></label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                        <FileWarning className="w-5 h-5" />
                      </div>
                      <input
                        id="subject"
                        {...register("subject", { required: "Subject is required" })}
                        placeholder="Short summary"
                        className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.subject ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 font-medium`}
                      />
                    </div>
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                        <AlertCircle className="w-4 h-4" /> {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <label htmlFor="type" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Type</label>
                    <div className="relative inline-block w-full md:w-64">
                      <select
                        id="type"
                        {...register("type", { required: true })}
                        className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-4 pr-10 py-3 text-slate-900 dark:text-white appearance-none outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 font-medium cursor-pointer`}
                      >
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="general">General Feedback</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mt-4">
                    <label htmlFor="message" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Message <span className="text-red-500">*</span></label>
                    <div className="relative group/input">
                      <div className="absolute top-5 left-5 pointer-events-none text-slate-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <textarea
                        id="message"
                        {...register("message", { required: "Message is required", minLength: { value: 10, message: "Message is too short" } })}
                        rows={6}
                        placeholder="Describe the issue or feedback in detail"
                        className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'} rounded-2xl pl-12 pr-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 resize-none font-medium`}
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1 ml-1" role="alert">
                        <AlertCircle className="w-4 h-4" /> {errors.message.message}
                      </p>
                    )}
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
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            <span>Submit Feedback</span>
                          </>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>
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
