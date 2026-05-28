import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Mail,
  User,
  FileText,
  Pencil,
  Sparkles,
} from "lucide-react";

import { instance as axios } from "../../helpers/axios/axionInstance";
import { getBaseUrl } from "../../helpers/config";
import storybook from "../../assets/storybook.png";

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

      const response = await axios.post(`${getBaseUrl()}/contact`, {
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (response && response.data?.success) {
        setSuccess(true);
        setFormData(INITIAL_FORM_DATA);
      } else {
        setError("✕ Failed to send message. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Contact Form Error:", err);




      const message =
        err instanceof Error
          ? err.message
          : "✕ Failed to send message. Please check your connection.";
      setError(message);

    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen overflow-hidden bg-white text-[#020617] dark:bg-[#020617] px-4 py-20 dark:text-white sm:px-6 lg:px-16"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),transparent_30%)]" />
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[140px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* Left */}
        <div>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[8px] text-blue-400">
            GET IN TOUCH
          </p>
          <h2 className="text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
            Contact{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <div className="mt-6 h-1 w-28 rounded-full bg-yellow-400" />

          <p className="mt-8 max-w-xl text-lg leading-9 text:[#020617] dark:text-slate-300">
            Have a story idea, suggestion, or just want to say hello? We’d love to
            hear from you.
          </p>

          <div className="relative mt-14 hidden items-center justify-start lg:flex">
            <img
              src={storybook}
              alt="storybook"
              className="w-full max-w-[420px] object-contain drop-shadow-[0_0_80px_rgba(139,92,246,0.45)]"
            />
            <div className="absolute -left-10 -bottom-10 h-52 w-52 rounded-full bg-purple-500/20 blur-[120px]" />
          </div>
        </div>

        {/* Form */}
        <div className="relative w-full max-w-xl">
          <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-blue-500 to-purple-600 blur opacity-10 transition duration-1000" />

          <form
            onSubmit={submitHandler}
            className="relative space-y-6 rounded-[2rem] border border-slate-200
bg-white
dark:border-white/10
dark:bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8 lg:p-10"
          >
            <div className="relative">
              <User className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
              <input
                type="text"
                name="fullname"
                placeholder="Your Name"
                value={formData.fullname}
                onChange={changeHandler}
                required
                className="h-16 w-full rounded-2xl border bg-white/[0.05] border-gray-400 dark:border-white/10 dark:bg-[#0b1120]/80 pl-14 pr-5 text-base text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={changeHandler}
                required
                className="h-16 w-full rounded-2xl border  bg-white/[0.05] border-gray-400 dark:border-white/10 dark:bg-[#0b1120]/80 pl-14 pr-5 text-base text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="relative">
              <FileText className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={changeHandler}
                required
                className="h-16 w-full rounded-2xl border  bg-white/[0.05] border-gray-400 dark:border-white/10 dark:bg-[#0b1120]/80 pl-14 pr-5 text-base text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="relative">
              <Pencil className="absolute left-5 top-7 h-5 w-5 text-purple-300" />
              <textarea
                rows={7}
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={changeHandler}
                required
                className="w-full resize-none rounded-2xl border  bg-white/[0.05] border-gray-400 dark:border-white/10 dark:bg-[#0b1120]/80 pl-14 pr-5 pt-6 text-base text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>

            {success && (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-4">
                <p className="text-center text-sm font-medium text-green-400 sm:text-base">
                  ✓ Message sent successfully. I’ll get back to you soon.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4">
                <p className="text-center text-sm font-medium text-red-400 sm:text-base">
                  {error}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}