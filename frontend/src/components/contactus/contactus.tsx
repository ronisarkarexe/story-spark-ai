import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Mail,
  User,
  FileText,
  Pencil,
  Send,
  GitBranch,
  Sparkles,
  AlertCircle,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { instance as axios } from "../../helpers/axios/axiosInstance";
import { getBaseUrl } from "../../helpers/config";
import storybook from "../../assets/storybook.png";
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

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email us",
    value: "ronichandrasarkar@gmail.com",
    href: "mailto:ronichandrasarkar@gmail.com",
    color: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500 dark:text-blue-400",
    hoverBorder: "hover:border-blue-500/30",
  },
  {
    icon: GitBranch,
    label: "GitHub",
    value: "ronisarkarexe/story-spark-ai",
    href: "https://github.com/ronisarkarexe/story-spark-ai",
    color: "from-purple-500/10 to-violet-500/10",
    iconColor: "text-purple-500 dark:text-purple-400",
    hoverBorder: "hover:border-purple-500/30",
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

const STATS = [
  { value: "24h", label: "Response time" },
  { value: "100%", label: "Read rate" },
  { value: "Open", label: "Source project" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// FloatingLabelInput
// ─────────────────────────────────────────────────────────────────────────────
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
}: FloatingLabelInputProps) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="contact-float-field group pt-1">
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
          required
          autoComplete={autoComplete}
          placeholder=" "
          aria-label={label}
          aria-invalid={error}
          className={[
            "contact-float-input",
            "py-3.5 pl-11 pr-4", // Added padding for better label/icon spacing
            isFloated ? "contact-float-input--active" : "",
            error ? "contact-float-input--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {/* Floating label */}
        <label
          htmlFor={id}
          className={`contact-float-label ${isFloated ? "contact-float-label--floated" : ""}`}
        >
          {label}
        </label>
        {/* Animated focus underline */}
        <span className="contact-float-underline" aria-hidden="true" />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FloatingLabelTextarea
// ─────────────────────────────────────────────────────────────────────────────
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
    <div className="contact-float-field group pt-1">
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
          rows={6} // Slightly increased for better usability
          name="message"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          placeholder=" "
          aria-label="Message"
          aria-invalid={error}
          className={[
            "contact-float-input contact-float-textarea",
            "py-3.5 pl-11 pr-4 resize-y min-h-[140px]", // Better padding + minimum height
            isFloated ? "contact-float-input--active" : "",
            error ? "contact-float-input--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {/* Floating label */}
        <label
          htmlFor="contact-message"
          className={`contact-float-label contact-float-label--textarea ${
            isFloated ? "contact-float-label--floated" : ""
          }`}
        >
          Message
        </label>
        {/* Animated focus underline */}
        <span className="contact-float-underline" aria-hidden="true" />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Contact component
// ─────────────────────────────────────────────────────────────────────────────
export default function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,,
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
      className="relative overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 w-full box-border"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 box-border">
        
        <div className="mb-8 flex flex-col items-center text-center lg:hidden select-none">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            <Zap className="h-3 w-3" aria-hidden="true" />
            Get in Touch
          </span>
        </div>

        <motion.div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12 xl:gap-16 w-full box-border">

          <div className="flex flex-col w-full box-border text-left">
            <span className="mb-6 hidden w-fit items-center gap-1.5 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider lg:inline-flex select-none">
              <Zap className="h-3 w-3" aria-hidden="true" />
              Get in Touch
            </span>

            <h1
              id="contact-heading"
              className="font-extrabold tracking-tight text-slate-900 dark:text-white text-3xl sm:text-5xl lg:text-6xl leading-tight"
            >
              Let's Start a <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                Conversation
              </span>
            </h1>

            <div aria-hidden="true" className="h-[2px] w-12 bg-gradient-to-r from-blue-600 to-indigo-600 mt-5 rounded-full select-none" />

            <p className="mt-5 max-w-md text-xs sm:text-sm lg:text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              Have a story idea, a feature suggestion, or just want to say
              hello? We read every message and respond within 24 hours.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 select-none w-full box-border">
              {[
                { value: "24h",   label: "Response time"  },
                { value: "100%",  label: "Read rate"      },
                { value: "Open",  label: "Source project" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white dark:border-white/5 dark:bg-[#111827]/40 p-3 text-center sm:p-4 shadow-sm"
                >
                  <p className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <ul
              className="mt-6 sm:mt-8 space-y-3 list-none p-0 m-0 w-full box-border"
              aria-label="Contact channels"
            >
              {CONTACT_CHANNELS.map(({
                  icon: Icon,
                  label,
                  value,
                  href,
                  color,
                  iconColor,
                  hoverBorder,
                }) => (
                <li key={label} className="w-full">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label}: ${value}`}
                    className={`group flex items-center gap-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827]/30 p-3 sm:p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-[1.005] hover:shadow-md ${hoverBorder}`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/10 bg-gradient-to-br ${color} ${iconColor} select-none`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                        {label}
                      </span>
                      <span className="block truncate text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300 select-none"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ),)}
            </ul>

            {/* Enhanced illustration + contact info area to utilize space */}
            <div className="mt-10 lg:mt-auto">
              <div
                aria-hidden="true"
                className="contact-illustration relative hidden items-end lg:flex"
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

              {/* Additional contact details to fill space and provide info */}
              <div className="mt-8 hidden lg:block">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                  Direct Contact
                </p>
                <a
                  href="mailto:ronichandrasarkar@gmail.com"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" /> ronichandrasarkar@gmail.com
                </a>
              </div>
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
          className="relative min-w-0"
        >
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-2xl" />

        <form
          onSubmit={submitHandler}
          className="relative w-full max-w-full space-y-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-2xl transition-all duration-300 hover:border-purple-500/30 sm:p-10"
        >
  {/* NAME */}
  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0b1120]/80 px-5 py-3 transition-all duration-300 hover:border-purple-400/40 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20">
  <User className="h-5 w-5 flex-shrink-0 text-purple-300" />

  <div className="flex flex-col flex-1 min-w-0">
    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-300">
      Full Name
    </label>

    <input
      type="text"
      name="fullname"
      value={formData.fullname}
      onChange={changeHandler}
      placeholder="John Doe"
      required
      className="w-full min-w-0 max-w-full bg-transparent border-none p-0 text-base text-white placeholder:text-slate-400 outline-none focus:ring-0"
    />
  </div>
</div>

  {/* EMAIL */}
  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0b1120]/80 px-5 py-3 transition-all duration-300 hover:border-blue-400/40 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
    <Mail className="h-5 w-5 flex-shrink-0 text-blue-300" />
    <div className="flex flex-col flex-1 min-w-0">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 block">
        Email Address
      </label>
     <input
  type="email"
  name="email"
  value={formData.email}
  onChange={changeHandler}
  placeholder="john@example.com"
  required
  className="w-full min-w-0 max-w-full bg-transparent border-none p-0 text-base text-white placeholder:text-slate-400 outline-none focus:ring-0"
/>
    </div>
  </div>

  {/* SUBJECT */}
  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0b1120]/80 px-5 py-3 transition-all duration-300 hover:border-pink-400/40 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20">
    <FileText className="h-5 w-5 flex-shrink-0 text-pink-300" />
    <div className="flex flex-col flex-1 min-w-0">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 block">
        Subject
      </label>
      <input
  type="text"
  name="subject"
  value={formData.subject}
  onChange={changeHandler}
  placeholder="Project Collaboration"
  required
  className="w-full min-w-0 bg-transparent border-none p-0 text-base text-white outline-none focus:ring-0"
/>
    </div>
  </div>

  {/* MESSAGE */}
  <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0b1120]/80 px-5 py-4 transition-all duration-300 hover:border-purple-400/40 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20">
    <Pencil className="mt-1 h-5 w-5 flex-shrink-0 text-purple-300" />
    <div className="flex flex-col flex-1 min-w-0">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-2 block">
        Message
      </label>
      <textarea
  rows={6}
  name="message"
  value={formData.message}
  onChange={changeHandler}
  placeholder="Tell us about your idea..."
  maxLength={500}
  required
  className="w-full min-w-0 max-w-full resize-none bg-transparent border-none p-0 text-base text-white placeholder:text-slate-400 outline-none focus:ring-0"
/>
<div className="mt-2 text-right text-xs text-slate-400">
  {formData.message.length}/500
</div>
    </div>
  </div>

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  aria-label={loading ? "Sending message…" : "Send message"}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 select-none uppercase tracking-wider cursor-pointer mt-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                      <span>Send Message</span>
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
      🎉 Thank you! Your message has been sent successfully.      </p>
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
