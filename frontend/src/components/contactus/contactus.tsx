import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";

import axios from "axios";

import {
  Mail,
  User,
  FileText,
  Pencil,
  Sparkles,
  Send,
  Clock3,
  Globe,
} from "lucide-react";

import { motion } from "framer-motion";

type FormData = {
  fullname: string;
  email: string;
  subject: string;
  message: string;
};

type FormField = "fullname" | "email" | "subject" | "message";

const INITIAL_FORM_DATA: FormData = {
  fullname: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const [error, setError] = useState<string>("");

  const [success, setSuccess] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const isSubmittingRef = useRef(false);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const fieldName = e.target.name as FormField;

    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const validateForm = (): boolean => {
    const trimmedData = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    if (
      !trimmedData.fullname ||
      !trimmedData.email ||
      !trimmedData.subject ||
      !trimmedData.message
    ) {
      setError("All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(trimmedData.email)) {
      setError("Please enter a valid email address.");
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

      // Replace this with your backend endpoint
      const response = await axios.post("/contact", {
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
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

      const message =
        err instanceof Error
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
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.22),transparent_30%)]" />

      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/20 blur-[140px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-20">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[8px] text-blue-400">
            GET IN TOUCH
          </p>

          <h2 className="text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
            Let&apos;s Build
            <br />

            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Something Amazing
            </span>
          </h2>

          <div className="mt-6 h-1 w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />

          <p className="mt-8 max-w-xl text-lg leading-9 text-slate-300">
            Have an idea, collaboration, feedback, or just want to say hello?
            We would love to hear from you.
          </p>

          {/* INFO CARDS */}
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <Clock3 className="mb-4 h-8 w-8 text-purple-400" />

              <p className="text-sm text-slate-400">
                Response Time
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Within 24 Hours
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              <Globe className="mb-4 h-8 w-8 text-blue-400" />

              <p className="text-sm text-slate-400">
                Community
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Worldwide Creators
              </h3>
            </div>
          </div>

          {/* GLOW ELEMENT */}
          <div className="relative mt-16 hidden items-center justify-center lg:flex">
            <div className="h-[320px] w-[320px] animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

            <div className="absolute flex h-44 w-44 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <Sparkles className="h-20 w-20 text-purple-400" />
            </div>
          </div>
        </motion.div>

      {/* RIGHT */}
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
  className="relative space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-2xl sm:p-10"
>
  {/* NAME */}
  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0b1120]/80 px-5 py-3 transition-all duration-300 hover:border-purple-400/40 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20">
    <User className="h-5 w-5 flex-shrink-0 text-purple-300" />
    <div className="flex flex-col flex-grow min-w-0">
      <label className="text-[10px] font-bold uppercase tracking-wider text-purple-300/80 mb-1 block">
        Full Name
      </label>
      <input
        type="text"
        name="fullname"
        value={formData.fullname}
        onChange={changeHandler}
        required
        className="w-full bg-transparent text-base text-white outline-none p-0 border-none focus:ring-0"
      />
    </div>
  </div>

  {/* EMAIL */}
  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0b1120]/80 px-5 py-3 transition-all duration-300 hover:border-blue-400/40 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
    <Mail className="h-5 w-5 flex-shrink-0 text-blue-300" />
    <div className="flex flex-col flex-grow min-w-0">
      <label className="text-[10px] font-bold uppercase tracking-wider text-blue-300/80 mb-1 block">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={changeHandler}
        required
        className="w-full bg-transparent text-base text-white outline-none p-0 border-none focus:ring-0"
      />
    </div>
  </div>

  {/* SUBJECT */}
  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0b1120]/80 px-5 py-3 transition-all duration-300 hover:border-pink-400/40 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20">
    <FileText className="h-5 w-5 flex-shrink-0 text-pink-300" />
    <div className="flex flex-col flex-grow min-w-0">
      <label className="text-[10px] font-bold uppercase tracking-wider text-pink-300/80 mb-1 block">
        Subject
      </label>
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={changeHandler}
        required
        className="w-full bg-transparent text-base text-white outline-none p-0 border-none focus:ring-0"
      />
    </div>
  </div>

  {/* MESSAGE */}
  <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0b1120]/80 px-5 py-4 transition-all duration-300 hover:border-purple-400/40 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20">
    <Pencil className="mt-1 h-5 w-5 flex-shrink-0 text-purple-300" />
    <div className="flex flex-col flex-grow min-w-0">
      <label className="text-[10px] font-bold uppercase tracking-wider text-purple-300/80 mb-2 block">
        Message
      </label>
      <textarea
        rows={6}
        name="message"
        value={formData.message}
        onChange={changeHandler}
        required
        className="w-full resize-none bg-transparent text-base text-white outline-none p-0 border-none focus:ring-0"
      />
    </div>
  </div>

  {/* BUTTON */}
  <button
    type="submit"
    disabled={loading}
    className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(168,85,247,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
  >
    <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    {loading ? (
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    ) : (
      <>
        <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
        <span>Send Message</span>
        <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </>
    )}
  </button>

  {/* SUCCESS & ERROR MESSAGE BLOCKS */}
  {success && (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-4"
    >
      <p className="text-center text-sm font-medium text-green-400 sm:text-base">
        ✓ Message sent successfully.
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
