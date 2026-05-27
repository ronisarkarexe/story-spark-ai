import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { instance as axios } from "../../helpers/axios/axionInstance";
import { getBaseUrl } from "../../helpers/config";

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

    // 1. TRUE synchronous lock: absolute first priority to block rapid clicks/spam
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      // 2. Clear state BEFORE any async gaps to prevent stale UI
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

      // 3. Backend response validation
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
      // 4. Release BOTH the lock and the loading state in all scenarios
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen px-4 py-16 relative flex items-center justify-center overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-20 md:px-10 lg:px-20"
    >
      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 blur-[130px] rounded-full" />

      {/* Main Container */}
      <div className="w-full max-w-5xl relative z-10">
        {/* Heading */}
        <div className="text-center mb-5 sm:mb-14">
          <p className="text-blue-500 uppercase tracking-[5px] sm:tracking-[7px] text-xs sm:text-sm mb-3 font-semibold dark:text-blue-400">
            GET IN TOUCH
          </p>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Contact <span className="text-blue-500 dark:text-blue-400">Me</span>
          </h2>

          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-5 rounded-full" />
        </div>

        {/* Form Container */}
          <div className="w-full max-w-xl mx-auto group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[1.5rem] blur opacity-10 group-hover:opacity-15 transition duration-1000"></div>

          <form
            onSubmit={submitHandler}
            className="
            w-full
            max-w-4xl
            bg-gray-100/80
            border
            border-gray-200
            rounded-[2rem]
            p-5
            sm:p-8
            md:p-10
            backdrop-blur-2xl
            space-y-6
            shadow-2xl
            transition-colors
            duration-300
            dark:bg-white/10
            dark:border-white/10
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
              bg-gray-100/80
              border
              border-gray-200
              rounded-2xl
              px-5
              py-4
              text-sm
              sm:text-base
              text-slate-900
              placeholder:text-slate-400
              outline-none
              transition-[border-color,box-shadow]
              duration-300
              hover:border-white/30
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
              bg-gray-100/80
              border
              border-gray-200
              rounded-2xl
              px-5
              py-4
              text-sm
              sm:text-base
              text-slate-900
              placeholder:text-slate-400
              outline-none
              transition-[border-color,box-shadow]
              duration-300
              hover:border-white/30
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
              bg-gray-100/80
              border
              border-gray-200
              rounded-2xl
              px-5
              py-4
              text-sm
              sm:text-base
              text-slate-900
              placeholder:text-slate-400
              outline-none
              transition-[border-color,box-shadow]
              duration-300
              hover:border-white/30
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
              bg-gray-100/80
              border
              border-gray-200
              rounded-2xl
              px-5
              py-4
              text-sm
              sm:text-base
              text-slate-900
              placeholder:text-slate-400
              outline-none
              resize-none
              transition-[border-color,box-shadow]
              duration-300
              hover:border-white/30
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
              relative
overflow-hidden
group/btn
w-full
py-4
rounded-2xl
bg-gray-400
text-black
font-bold
text-sm
sm:text-base
transition-[background-color,transform]
duration-300
hover:scale-[1.01]
hover:bg-white
disabled:opacity-50
disabled:cursor-not-allowed
          "
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-slate-400/30 dark:border-t-slate-900" />
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
                  ✓ Message sent successfully. I’ll get back to you soon.
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
    </section>
  );
}
