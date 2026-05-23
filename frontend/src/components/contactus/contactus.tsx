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
      className="min-h-screen bg-[#030712] text-white px-4 py-12 relative overflow-hidden flex items-center justify-center font-sans"
    >
      {/* Background Orbs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/15 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-600/15 blur-[100px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-blue-400 text-[11px] font-bold tracking-[0.2em] uppercase mb-2 block opacity-80">
            GET IN TOUCH
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 leading-tight">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Me</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-lg group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[1.5rem] blur opacity-10 group-hover:opacity-15 transition duration-1000"></div>
          
          <form
            onSubmit={submitHandler}
            className="
              relative
              w-full
              bg-[#111827]/40
              backdrop-blur-2xl
              border
              border-white/10
              rounded-[1.5rem]
              p-5
              md:p-8
              space-y-4
              shadow-2xl
              transition-all
              duration-500
              hover:border-white/20
            "
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold text-gray-400 ml-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Enter your name"
                  value={formData.fullname}
                  onChange={changeHandler}
                  className="
                    w-full
                    bg-white/[0.03]
                    border
                    border-white/10
                    rounded-lg
                    px-4
                    py-2.5
                    text-sm
                    placeholder:text-gray-600
                    outline-none
                    transition-all
                    duration-300
                    hover:bg-white/[0.05]
                    focus:bg-white/[0.07]
                    focus:border-blue-500/50
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@example.com"
                  value={formData.email}
                  onChange={changeHandler}
                  className="
                    w-full
                    bg-white/[0.03]
                    border
                    border-white/10
                    rounded-lg
                    px-4
                    py-2.5
                    text-sm
                    placeholder:text-gray-600
                    outline-none
                    transition-all
                    duration-300
                    hover:bg-white/[0.05]
                    focus:bg-white/[0.07]
                    focus:border-blue-500/50
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-semibold text-gray-400 ml-1 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="How can I help you?"
                value={formData.subject}
                onChange={changeHandler}
                className="
                  w-full
                  bg-white/[0.03]
                  border
                  border-white/10
                  rounded-lg
                  px-4
                  py-2.5
                  text-sm
                  placeholder:text-gray-600
                  outline-none
                  transition-all
                  duration-300
                  hover:bg-white/[0.05]
                  focus:bg-white/[0.07]
                  focus:border-blue-500/50
                  focus:ring-4
                  focus:ring-blue-500/10
                "
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-semibold text-gray-400 ml-1 uppercase tracking-wider">Your Message</label>
              <textarea
                rows={4}
                name="message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={changeHandler}
                className="
                  w-full
                  bg-white/[0.03]
                  border
                  border-white/10
                  rounded-lg
                  px-4
                  py-2.5
                  text-sm
                  placeholder:text-gray-600
                  outline-none
                  resize-none
                  transition-all
                  duration-300
                  hover:bg-white/[0.05]
                  focus:bg-white/[0.07]
                  focus:border-blue-500/50
                  focus:ring-4
                  focus:ring-blue-500/10
                "
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                group/btn
                relative
                py-3
                rounded-lg
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                font-bold
                text-sm
                overflow-hidden
                transition-all
                duration-300
                hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)]
                hover:scale-[1.01]
                active:scale-[0.99]
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:scale-100
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

            {/* Status Messages */}
            <div className="min-h-[16px]">
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 animate-in fade-in zoom-in duration-300">
                  <p className="text-green-400 text-[11px] font-medium text-center flex items-center justify-center gap-2">
                    ✓ Message sent successfully!
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 animate-in fade-in zoom-in duration-300">
                  <p className="text-red-400 text-[11px] font-medium text-center">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
