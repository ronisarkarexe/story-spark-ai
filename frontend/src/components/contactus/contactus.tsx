import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Mail,
  User,
  FileText,
  Pencil,
  Send,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Zap,
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

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email us",
    value: "ronichandrasarkar@gmail.com",
    href: "mailto:ronichandrasarkar@gmail.com",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    icon: GitBranch,
    label: "GitHub",
    value: "ronisarkarexe/story-spark-ai",
    href: "https://github.com/ronisarkarexe/story-spark-ai",
    color: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400",
    hoverBorder: "hover:border-purple-500/40",
  },
];

const FORM_FIELDS = [
  {
    id: "contact-fullname",
    name: "fullname" as FormField,
    type: "text",
    label: "Full Name",
    placeholder: "Jane Smith",
    icon: User,
    autoComplete: "name",
  },
  {
    id: "contact-email",
    name: "email" as FormField,
    type: "email",
    label: "Email Address",
    placeholder: "jane@example.com",
    icon: Mail,
    autoComplete: "email",
  },
  {
    id: "contact-subject",
    name: "subject" as FormField,
    type: "text",
    label: "Subject",
    placeholder: "What's this about?",
    icon: FileText,
    autoComplete: "off",
  },
];

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
    setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    const t = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };
    if (!t.fullname || !t.email || !t.subject || !t.message) {
      setError("All fields are required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.email)) {
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
      if (response?.data?.success) {
        setSuccess(true);
        setFormData(INITIAL_FORM_DATA);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Contact Form Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please check your connection.",
      );
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="contact-section relative overflow-hidden bg-[#020617] text-white"
    >
      {/* ── Layered background ── */}
      <div aria-hidden="true" className="contact-bg-mesh" />
      <div aria-hidden="true" className="contact-orb contact-orb-blue" />
      <div aria-hidden="true" className="contact-orb contact-orb-purple" />
      <div aria-hidden="true" className="contact-orb contact-orb-pink" />
      <div aria-hidden="true" className="contact-grid-overlay" />

      {/* ── Page content ── */}
      <div className="contact-wrapper relative z-10 mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20 xl:px-16">

        {/* Mobile badge */}
        <div className="mb-10 flex flex-col items-center text-center lg:hidden">
          <span className="contact-badge inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            <Zap className="h-3 w-3" aria-hidden="true" />
            Get in Touch
          </span>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 xl:gap-20">

          {/* ── LEFT COLUMN ── */}
          <div className="contact-col-left flex flex-col">

            {/* Desktop badge */}
            <span className="contact-badge mb-6 hidden w-fit items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300 lg:inline-flex">
              <Zap className="h-3 w-3" aria-hidden="true" />
              Get in Touch
            </span>

            {/* Heading */}
            <h1
              id="contact-heading"
              className="font-black leading-[0.9] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="block text-[clamp(2.75rem,6vw,4.5rem)] text-white">
                Let's Start a
              </span>
              <span className="contact-heading-gradient block text-[clamp(2.75rem,6vw,4.5rem)]">
                Conversation
              </span>
            </h1>

            {/* Accent bar */}
            <div aria-hidden="true" className="contact-accent-bar mt-5" />

            {/* Description */}
            <p className="mt-6 max-w-[38ch] text-[0.9375rem] leading-[1.8] text-slate-400 sm:text-base">
              Have a story idea, a feature suggestion, or just want to say
              hello? We read every message and respond within 24 hours.
            </p>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { value: "24h",   label: "Response time"  },
                { value: "100%",  label: "Read rate"      },
                { value: "Open",  label: "Source project" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="contact-stat-card rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 text-center sm:p-4"
                >
                  <p className="text-lg font-black text-white sm:text-xl">{value}</p>
                  <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact channels */}
            <ul className="mt-7 space-y-2.5 sm:mt-8" aria-label="Contact channels">
              {CONTACT_CHANNELS.map(({ icon: Icon, label, value, href, color, iconColor, hoverBorder }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label}: ${value}`}
                    className={`contact-channel-link group flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm ${hoverBorder}`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} ${iconColor}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                        {label}
                      </span>
                      <span className="block truncate text-sm font-medium text-slate-300 group-hover:text-white">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-400"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>

            {/* Illustration */}
            <div aria-hidden="true" className="contact-illustration relative mt-10 hidden items-end lg:flex">
              <div className="contact-illustration-glow" />
              <img
                src={storybook}
                alt=""
                className="relative z-10 w-full max-w-[340px] object-contain xl:max-w-[380px]"
              />
            </div>
          </div>

          {/* ── RIGHT COLUMN — FORM ── */}
          <div className="contact-col-right w-full lg:sticky lg:top-24">
            <div className="contact-form-shell">
              <div aria-hidden="true" className="contact-form-glow-ring" />

              <div className="contact-form-card">
                <div aria-hidden="true" className="contact-form-top-line" />

                {/* Form header */}
                <div className="mb-7">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Send a Message
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-500">
                    We'll get back to you within 24 hours.
                  </p>
                </div>

                <form
                  onSubmit={submitHandler}
                  noValidate
                  aria-label="Contact form"
                  className="space-y-4"
                >
                  {/* Text inputs */}
                  {FORM_FIELDS.map(({ id, name, type, label, placeholder, icon: Icon, autoComplete }) => (
                    <div key={id} className="contact-field group">
                      <label
                        htmlFor={id}
                        className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-500"
                      >
                        {label}
                      </label>
                      <div className="relative">
                        <Icon
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 transition-colors duration-200 group-focus-within:text-purple-400"
                        />
                        <input
                          id={id}
                          type={type}
                          name={name}
                          placeholder={placeholder}
                          value={formData[name]}
                          onChange={changeHandler}
                          required
                          autoComplete={autoComplete}
                          className="contact-input h-12 w-full rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-slate-600 sm:h-[3.125rem] sm:text-base"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Message textarea */}
                  <div className="contact-field group">
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-500"
                    >
                      Message
                    </label>
                    <div className="relative">
                      <Pencil
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-slate-600 transition-colors duration-200 group-focus-within:text-purple-400"
                      />
                      <textarea
                        id="contact-message"
                        rows={5}
                        name="message"
                        placeholder="Tell us what's on your mind…"
                        value={formData.message}
                        onChange={changeHandler}
                        required
                        className="contact-input w-full resize-none rounded-xl pb-4 pl-10 pr-4 pt-4 text-sm text-white placeholder:text-slate-600 sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    aria-label={loading ? "Sending message…" : "Send message"}
                    className="contact-submit-btn group relative mt-1 flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl text-sm font-bold text-white sm:h-[3.125rem] sm:text-base"
                  >
                    <span aria-hidden="true" className="contact-btn-gradient absolute inset-0" />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span className="relative flex items-center gap-2.5">
                      {loading ? (
                        <>
                          <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <Send
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                          <span>Send Message</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Success */}
                  {success && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3.5"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      <p className="text-sm font-medium text-emerald-400">
                        Message sent — we'll get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                      <p className="text-sm font-medium text-red-400">{error}</p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
