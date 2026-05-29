import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import axios from "axios";
import { motion } from "framer-motion";
import {
  Clock3,
  FileText,
  Globe,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { getBaseUrl } from "../../helpers/config";

type FeedbackType = "bug-report" | "feature-request" | "general-feedback";

type SupportFormData = {
  fullname: string;
  email: string;
  feedbackType: FeedbackType;
  subject: string;
  message: string;
};

type SupportFormField = keyof SupportFormData;

const INITIAL_FORM_DATA: SupportFormData = {
  fullname: "",
  email: "",
  feedbackType: "general-feedback",
  subject: "",
  message: "",
};

const FEEDBACK_OPTIONS: Array<{
  value: FeedbackType;
  label: string;
  description: string;
}> = [
  {
    value: "bug-report",
    label: "Bug report",
    description: "Something is broken or not working as expected.",
  },
  {
    value: "feature-request",
    label: "Feature request",
    description: "Share an idea that would improve the product.",
  },
  {
    value: "general-feedback",
    label: "General feedback",
    description: "Tell us what feels good or where we can improve.",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState<SupportFormData>(INITIAL_FORM_DATA);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isSubmittingRef = useRef(false);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const fieldName = e.target.name as SupportFormField;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: e.target.value,
    }));
  };

  const validateForm = (): boolean => {
    const trimmedData = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      feedbackType: formData.feedbackType,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    if (!trimmedData.subject) {
      setError("Subject is required.");
      return false;
    }

    if (!trimmedData.message) {
      setError("Message is required.");
      return false;
    }

    if (trimmedData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!emailRegex.test(trimmedData.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
    }

    if (!trimmedData.feedbackType) {
      setError("Please select a feedback type.");
      return false;
    }

    return true;
  };

  const submitHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;

    try {
      setError("");
      setSuccess(false);

      if (!validateForm()) return;

      setLoading(true);

      const baseUrl = getBaseUrl().replace(/\/$/, "");
      const response = await axios.post(`${baseUrl}/contact`, {
        fullname: formData.fullname.trim() || undefined,
        email: formData.email.trim() || undefined,
        feedbackType: formData.feedbackType,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (response?.data?.success || response.status === 200) {
        setSuccess(true);
        setFormData(INITIAL_FORM_DATA);
      } else {
        setError("Failed to send message.");
      }
    } catch (err: unknown) {
      console.error(err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Something went wrong."
        : err instanceof Error
          ? err.message
          : "Something went wrong.";

      setError(message);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#020617] px-5 py-24 text-white sm:px-8 lg:px-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.22),transparent_30%)]" />
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/20 blur-[140px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-[0.92fr_1.08fr] xl:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[8px] text-blue-400">
            Support & Feedback
          </p>

          <h2 className="text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
            Share what is
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              on your mind
            </span>
          </h2>

          <div className="mt-6 h-1 w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />

          <p className="mt-8 max-w-xl text-lg leading-9 text-slate-300">
            Report a bug, request a feature, or send general feedback without
            leaving the app. Name and email are optional, so you can stay
            anonymous if you prefer.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <Clock3 className="mb-4 h-8 w-8 text-purple-400" />
              <p className="text-sm text-slate-400">Response Time</p>
              <h3 className="mt-2 text-xl font-bold">Within 24 Hours</h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              <Globe className="mb-4 h-8 w-8 text-blue-400" />
              <p className="text-sm text-slate-400">Accessible</p>
              <h3 className="mt-2 text-xl font-bold">Desktop and Mobile</h3>
            </div>
          </div>

          <div className="relative mt-16 hidden items-center justify-center lg:flex">
            <div className="h-[320px] w-[320px] animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
            <div className="absolute flex h-44 w-44 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <Sparkles className="h-20 w-20 text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-2xl" />

          <form
            onSubmit={submitHandler}
            className="relative space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.05] px-6 py-8 backdrop-blur-2xl"
          >
            <div className="grid gap-4">
              <label className="block min-w-0">
                <span className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  <User className="h-4 w-4 text-purple-300" />
                  Name <span className="text-slate-500 normal-case tracking-normal">(optional)</span>
                </span>

                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={changeHandler}
                  placeholder="Your name"
                  className="h-14 w-full box-border rounded-2xl border border-white/10 bg-[#0b1120]/80 px-6 text-[14px] text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-purple-400/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </label>

              <label className="block min-w-0">
                <span className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  <Mail className="h-4 w-4 text-blue-300" />
                  Email <span className="text-slate-500 normal-case tracking-normal">(optional)</span>
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                  placeholder="you@example.com"
                  className="h-14 w-full box-border rounded-2xl border border-white/10 bg-[#0b1120]/80 px-6 text-[14px] text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-blue-400/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
            </div>

            <label className="block min-w-0">
              <span className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                <MessageSquare className="h-4 w-4 text-pink-300" />
                Feedback Type
              </span>

              <select
                name="feedbackType"
                value={formData.feedbackType}
                onChange={changeHandler}
                className="h-14 w-full box-border rounded-2xl border border-white/10 bg-[#0b1120]/80 px-6 text-[14px] text-white outline-none transition-all duration-300 hover:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              >
                {FEEDBACK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#0b1120]">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] leading-6 text-slate-300">
              {FEEDBACK_OPTIONS.find((option) => option.value === formData.feedbackType)?.description}
            </div>

            <label className="block min-w-0">
              <span className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                <FileText className="h-4 w-4 text-emerald-300" />
                Subject
              </span>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={changeHandler}
                placeholder="Summarize your feedback"
                className="h-14 w-full box-border rounded-2xl border border-white/10 bg-[#0b1120]/80 px-6 text-[14px] text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-emerald-400/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                <Sparkles className="h-4 w-4 text-purple-300" />
                Message
              </span>

              <textarea
                rows={7}
                name="message"
                value={formData.message}
                onChange={changeHandler}
                placeholder="Tell us what happened or what you'd like to see improved"
                className="min-h-[170px] w-full box-border resize-y rounded-2xl border border-white/10 bg-[#0b1120]/80 px-6 py-4 text-[14px] leading-6 text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-purple-400/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-[15px] font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(168,85,247,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>Send Feedback</span>
                  <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                </>
              )}
            </button>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-4"
              >
                <p className="text-center text-sm font-medium text-green-400 sm:text-base">
                  ✓ Thanks for sharing. Your feedback was sent successfully.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4"
              >
                <p className="text-center text-sm font-medium text-red-400 sm:text-base">
                  {error}
                </p>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
