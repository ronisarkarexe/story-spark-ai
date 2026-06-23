import { useState, useRef, useEffect } from "react";
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
  MapPin,
  Clock,
  Briefcase,
  // Twitter,
  // Linkedin,
  // Github,
  Globe,
  MessageCircle,
} from "lucide-react";

import { instance as axios } from "../../helpers/axios/axiosInstance";
import { getBaseUrl } from "../../helpers/config";
import storybook from "../../assets/storybook.png";

// --- Types ---

type FormData = {
  fullname: string;
  email: string;
  subject: string;
  message: string;
};

type FormField = keyof FormData;

// --- Constants ---

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
 ] as const;

const INFO_CARDS = [
  {
    icon: MapPin,
    label: "Location",
    value: "Remote – Worldwide",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Briefcase,
    label: "Availability",
    value: "Open to freelance",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: MessageCircle,
    label: "Response Rate",
    value: "100% read rate",
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
];

const SOCIAL_LINKS = [
  {
    icon: GitBranch,
    label: "GitHub",
    href: "https://github.com/ronisarkarexe",
    color: "hover:bg-slate-700/50 hover:border-slate-500/40 hover:text-white",
  },
  {
    icon: Globe,
    label: "LinkedIn",
    href: "https://linkedin.com/in/ronisarkarexe",
    color: "hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400",
  },
  {
    icon: MessageCircle,
    label: "Twitter / X",
    href: "https://twitter.com/ronisarkarexe",
    color: "hover:bg-sky-500/20 hover:border-sky-500/40 hover:text-sky-400",
  },
  {
    icon: Globe,
    label: "Portfolio",
    href: "https://ronisarkarexe.github.io",
    color: "hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-400",
  },
];

const FORM_FIELDS: Array<{
  id: string;
  name: FormField;
  type: string;
  label: string;
  placeholder: string;
  icon: React.ElementType;
  autoComplete: string;
  required: boolean;
}> = [
  {
    id: "contact-fullname",
    name: "fullname",
    type: "text",
    label: "Full Name",
    placeholder: "Jane Smith",
    icon: User,
    autoComplete: "name",
    required: true,
  },
  {
    id: "contact-email",
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "jane@example.com",
    icon: Mail,
    autoComplete: "email",
    required: true,
  },
  {
    id: "contact-subject",
    name: "subject",
    type: "text",
    label: "Subject",
    placeholder: "What's this about?",
    icon: FileText,
    autoComplete: "off",
    required: true,
  },
];

const STATS = [
  { value: "24h", label: "Response time" },
  { value: "100%", label: "Read rate" },
  { value: "Open", label: "Source project" },
] as const;

// --- FloatingLabelInput ---

interface FloatingLabelInputProps {
  id: string;
  name: FormField;
  type: string;
  label: string;
  icon: React.ElementType;
  autoComplete: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  required?: boolean;
}

const FloatingLabelInput = ({
  id,
  name,
  type,
  label,
  icon: Icon,
  autoComplete,
  value,
  onChange,
  error = false,
  required = false,
}: FloatingLabelInputProps) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="contact-float-field group">
      <div className="relative">
        {/* Icon */}
        <span
          className={`contact-float-icon ${isFloated ? "contact-float-icon--active" : ""}`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>

        {/* Input */}
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          autoComplete={autoComplete}
          placeholder=" "
          aria-label={label}
          aria-invalid={error}
          aria-required={required}
          className={[
            "contact-float-input",
            isFloated ? "contact-float-input--active" : "",
            error ? "contact-float-input--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Floating label with required indicator */}
        <label
          htmlFor={id}
          className={`contact-float-label ${isFloated ? "contact-float-label--floated" : ""}`}
        >
          {label}
          {required && (
            <span className="contact-required-star" aria-hidden="true"> *</span>
          )}
        </label>

        {/* Animated focus underline */}
        <span className="contact-float-underline" aria-hidden="true" />
      </div>

      {/* Inline validation feedback */}
      {error && (
        <p className="contact-field-error-msg" role="alert">
          <AlertCircle className="inline h-3 w-3 mr-1" aria-hidden="true" />
          {name === "email" ? "Please enter a valid email address." : `${label} is required.`}
        </p>
      )}
    </div>
  );
};

// --- FloatingLabelTextarea ---

interface FloatingLabelTextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: boolean;
}

const FloatingLabelTextarea = ({
  value,
  onChange,
  error = false,
}: FloatingLabelTextareaProps) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="contact-float-field group">
      <div className="relative">
        {/* Icon */}
        <span
          className={`contact-float-icon contact-float-icon--textarea ${
            isFloated ? "contact-float-icon--active" : ""
          }`}
          aria-hidden="true"
        >
          <Pencil className="h-4 w-4" />
        </span>

        {/* Textarea */}
        <textarea
          id="contact-message"
          rows={5}
          name="message"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          placeholder=" "
          aria-label="Message"
          aria-invalid={error}
          aria-required="true"
          className={[
            "contact-float-input contact-float-textarea",
            isFloated ? "contact-float-input--active" : "",
            error ? "contact-float-input--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Floating label with required indicator */}
        <label
          htmlFor="contact-message"
          className={`contact-float-label contact-float-label--textarea ${
            isFloated ? "contact-float-label--floated" : ""
          }`}
        >
          Message
          <span className="contact-required-star" aria-hidden="true"> *</span>
        </label>

        {/* Animated focus underline */}
        <span className="contact-float-underline" aria-hidden="true" />
      </div>

      {error && (
        <p className="contact-field-error-msg" role="alert">
          <AlertCircle className="inline h-3 w-3 mr-1" aria-hidden="true" />
          Message is required.
        </p>
      )}
    </div>
  );
};

// --- Main Contact component ---

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormField, boolean>>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isSubmittingRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const field = e.target.name as FormField;
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateForm = (): boolean => {
    const t: FormData = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };
    const newFieldErrors: Partial<Record<FormField, boolean>> = {};

    if (!t.fullname) newFieldErrors.fullname = true;
    if (!t.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.email))
      newFieldErrors.email = true;
    if (!t.subject) newFieldErrors.subject = true;
    if (!t.message) newFieldErrors.message = true;

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      if (!t.fullname || !t.email || !t.subject || !t.message) {
        setError("All fields are required.");
      } else {
        setError("Please enter a valid email address.");
      }
      return false;
    }
    return true;
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
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
        setFieldErrors({});
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Contact Form Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please check your connection."
      );
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="contact-section relative overflow-hidden bg-[#020617] text-white"
    >
      {/* Layered background */}
      <div aria-hidden="true" className="contact-bg-mesh" />
      <div aria-hidden="true" className="contact-orb contact-orb-blue" />
      <div aria-hidden="true" className="contact-orb contact-orb-purple" />
      <div aria-hidden="true" className="contact-orb contact-orb-pink" />
      <div aria-hidden="true" className="contact-grid-overlay" />

      {/* Page content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20 xl:px-16">

        {/* Mobile badge */}
        <div className="mb-10 flex flex-col items-center text-center lg:hidden">
          <span
            className={`contact-badge inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Zap className="h-3 w-3" aria-hidden="true" />
            Get in Touch
          </span>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 xl:gap-20">

          {/* LEFT COLUMN */}
          <div
            className={`contact-col-left flex flex-col transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
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

            {/* Intro description — improved */}
            <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-[1.8] text-slate-400 sm:text-base">
              I'm always open to discussing new ideas, collaborations, freelance
              work, or creative projects. Have a story idea or feature suggestion?
              Drop me a message — I read everything and reply within 24 hours.
            </p>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="contact-stat-card rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 text-center sm:p-4"
                  style={{
                    transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
                  }}
                >
                  <p className="text-lg font-black text-white sm:text-xl">{value}</p>
                  <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Info cards grid */}
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3">
              {INFO_CARDS.map(({ icon: Icon, label, value, color, iconColor }) => (
                <div
                  key={label}
                  className="contact-info-card flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3 backdrop-blur-sm"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} ${iconColor}`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-slate-500">
                      {label}
                    </span>
                    <span className="block truncate text-xs font-semibold text-slate-300">
                      {value}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* Contact channels */}
            <ul className="mt-5 space-y-2.5 sm:mt-6" aria-label="Contact channels">
              {CONTACT_CHANNELS.map(
                ({ icon: Icon, label, value, href, color, iconColor, hoverBorder }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label}: ${value}`}
                      className={`contact-channel-link group flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm ${hoverBorder}`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} ${iconColor}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                          {label}
                        </span>
                        <span className="block truncate text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200">
                          {value}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-400"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                )
              )}
            </ul>

            {/* Social media links */}
            <div className="mt-6">
              <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                Find me on
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`contact-social-btn flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-500 transition-all duration-200 ${color}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Illustration */}
            <div
              aria-hidden="true"
              className="contact-illustration relative mt-10 hidden items-end lg:flex"
            >
              <div className="contact-illustration-glow" />
              <img
                src={storybook}
                alt=""
                loading="lazy"
                decoding="async"
                className="relative z-10 w-full max-w-[340px] object-contain xl:max-w-[380px]"
              />
            </div>
          </div>

          {/* RIGHT COLUMN — FORM */}
          <div
            className={`contact-col-right w-full lg:sticky lg:top-24 transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="contact-form-shell">
              <div aria-hidden="true" className="contact-form-glow-ring" />

              <div className="contact-form-card">
                <div aria-hidden="true" className="contact-form-top-line" />

                {/* Form header */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Send a Message
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-400">
                    All fields marked <span className="text-violet-400 font-semibold">*</span> are required. We'll reply within 24 hours.
                  </p>
                </div>

                <form
                  onSubmit={submitHandler}
                  noValidate
                  aria-label="Contact form"
                  className="space-y-5"
                >
                  {/* Floating label text inputs */}
                  {FORM_FIELDS.map(({ id, name, type, label, icon, autoComplete, required }) => (
                    <FloatingLabelInput
                      key={id}
                      id={id}
                      name={name}
                      type={type}
                      label={label}
                      icon={icon}
                      autoComplete={autoComplete}
                      value={formData[name]}
                      onChange={changeHandler}
                      error={fieldErrors[name]}
                      required={required}
                    />
                  ))}

                  {/* Floating label textarea */}
                  <FloatingLabelTextarea
                    value={formData.message}
                    onChange={changeHandler}
                    error={fieldErrors.message}
                  />

                  {/* Global error banner */}
                  {error && !Object.values(fieldErrors).some(Boolean) && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 contact-fade-in"
                    >
                      <AlertCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    aria-label={loading ? "Sending message…" : "Send message"}
                    className="contact-submit-btn group relative mt-1 flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl text-sm font-bold text-white sm:h-[3.125rem] sm:text-base"
                  >
                    <span aria-hidden="true" className="contact-btn-gradient absolute inset-0" />
                    {/* Shimmer sweep on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span className="relative flex items-center gap-2.5">
                      {loading ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                          />
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
                      className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-4 contact-fade-in"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-emerald-400">
                          Message sent successfully!
                        </p>
                        <p className="mt-0.5 text-xs text-emerald-500/80">
                          We'll get back to you within 24 hours.
                        </p>
                      </div>
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
