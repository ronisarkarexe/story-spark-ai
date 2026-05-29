import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import emailjs from "@emailjs/browser";

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

const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY ?? "";
const TEMPLATE_KEY = import.meta.env.VITE_TEMPLATE_KEY ?? "";
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY ?? "";

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
    if (loading) return;

    setError("");
    setSuccess(false);

    const isValid = validateForm();
    if (!isValid) return;

    if (!SERVICE_KEY || !TEMPLATE_KEY || !PUBLIC_KEY) {
      setError("Email service is currently unavailable. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        SERVICE_KEY,
        TEMPLATE_KEY,
        {
          fullname: formData.fullname.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
        PUBLIC_KEY,
      );

      setSuccess(true);
      setFormData(INITIAL_FORM_DATA);
    } catch (err: unknown) {
      console.error("EmailJS Error:", err);
      setError("✕ Failed to send message. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen text-white px-4 sm:px-6 md:px-10 lg:px-20 py-16 sm:py-20 relative overflow-hidden flex items-center justify-center"
    >
      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 blur-[130px] rounded-full" />

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-blue-400 uppercase tracking-[5px] sm:tracking-[7px] text-xs sm:text-sm mb-3 font-semibold">
            GET IN TOUCH
          </p>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Contact <span className="text-blue-400">Me</span>
          </h2>

          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-5 rounded-full" />
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-stretch">
          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-500" />

            <p className="text-blue-300 uppercase tracking-[4px] text-xs font-semibold mb-4">
              Let&apos;s talk
            </p>

            <h3 className="text-2xl sm:text-3xl font-bold leading-tight max-w-sm">
              Share your idea, and I&apos;ll help turn it into something polished.
            </h3>

            <p className="mt-4 text-sm sm:text-base text-white/70 leading-7 max-w-md">
              Use the form to send a quick note. I usually reply within one business day, and I&apos;m happy to discuss collaboration, feedback, or feature ideas.
            </p>

            <div className="mt-8 space-y-4 text-sm sm:text-base text-white/80">
              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
                Fast response for product and design questions.
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
                Open to freelance, open-source, and community work.
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
                Prefer email? Fill in the form and I&apos;ll take it from there.
              </div>
            </div>
          </aside>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[1.5rem] blur opacity-10 group-hover:opacity-15 transition duration-1000"></div>

            <form
              onSubmit={submitHandler}
              className="
              relative
              w-full
              bg-white/[0.05]
              border
              border-white/10
              rounded-[2rem]
              p-5
              sm:p-8
              md:p-10
              backdrop-blur-2xl
              space-y-6
              shadow-2xl
            "
            >
              {/* Name */}
              <input
                type="text"
                name="fullname"
                placeholder="Your Name"
                value={formData.fullname}
                onChange={changeHandler}
                className="
                w-full
                bg-white/[0.04]
                border
                border-white/10
                rounded-2xl
                px-5
                py-4
                text-sm
                sm:text-base
                outline-none
                transition-all
                duration-300
                focus:border-yellow-400
                focus:ring-2
                focus:ring-yellow-400/30
              "
                required
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={changeHandler}
                className="
                w-full
                bg-white/[0.04]
                border
                border-white/10
                rounded-2xl
                px-5
                py-4
                text-sm
                sm:text-base
                outline-none
                transition-all
                duration-300
                focus:border-yellow-400
                focus:ring-2
                focus:ring-yellow-400/30
              "
                required
              />

              {/* Subject */}
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={changeHandler}
                className="
                w-full
                bg-white/[0.04]
                border
                border-white/10
                rounded-2xl
                px-5
                py-4
                text-sm
                sm:text-base
                outline-none
                transition-all
                duration-300
                focus:border-yellow-400
                focus:ring-2
                focus:ring-yellow-400/30
              "
                required
              />

              {/* Message */}
              <textarea
                rows={7}
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={changeHandler}
                className="
                w-full
                bg-white/[0.04]
                border
                border-white/10
                rounded-2xl
                px-5
                py-4
                text-sm
                sm:text-base
                outline-none
                resize-none
                transition-all
                duration-300
                focus:border-yellow-400
                focus:ring-2
                focus:ring-yellow-400/30
              "
                required
              />

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                group/btn
                relative
                w-full
                overflow-hidden
                py-4
                rounded-2xl
                bg-gray-400
                text-black
                font-bold
                text-sm
                sm:text-base
                transition-all
                duration-300
                hover:scale-[1.01]
                hover:bg-white
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Success */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl px-4 py-4">
                  <p className="text-green-400 text-sm sm:text-base font-medium text-center">
                    ✓ Message sent successfully. I&apos;ll get back to you soon.
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-4">
                  <p className="text-red-400 text-sm sm:text-base font-medium text-center">
                    {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
