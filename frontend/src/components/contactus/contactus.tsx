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
      className="min-h-screen px-4 py-16 relative flex items-center justify-center overflow-hidden bg-[#fdf8f0] text-[#2c1810] transition-colors duration-300 dark:bg-[#1a0f08] dark:text-[#f5ead6] sm:px-6 sm:py-20 md:px-10 lg:px-20 parchment-page"
    >
      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#c9a227]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#8b5e3c]/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-14">
          <p className="text-[#8b5e3c] uppercase tracking-[5px] sm:tracking-[7px] text-xs sm:text-sm mb-3 font-semibold font-[Cormorant_Garamond] dark:text-[#d4b896]">
            GET IN TOUCH
          </p>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6]">
            Contact <span className="text-[#8b1a1a] dark:text-[#c9a227]">Us</span>
          </h2>

          <div className="w-24 h-1 bg-[#c9a227]/70 mx-auto mt-4 rounded-full" />
        </div>

        {/* Form Container */}

        <div className="w-full max-w-lg group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#8b1a1a] to-[#c9a227] rounded-[1rem] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
=======
          <div className="w-full max-w-xl mx-auto group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[1.5rem] blur opacity-10 group-hover:opacity-15 transition duration-1000"></div>

          <form
            onSubmit={submitHandler}
            className="
              w-full
              max-w-4xl
              bg-[#f5ead6]
              border
              border-[#d4b896]
              rounded-[1rem]
              p-6
              sm:p-10
              space-y-6
              shadow-xl
              transition-all
              duration-300
              dark:bg-[#2c1810]
              dark:border-[#5c3d2e]
            "
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5c3d2e] dark:text-[#d4b896] mb-2 font-[Cormorant_Garamond]">
                Your Name
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="E.g., Arthur Pendragon"
                value={formData.fullname}
                onChange={changeHandler}
                className="
                  w-full
                  bg-[#fdf8f0]
                  border
                  border-[#d4b896]
                  rounded-lg
                  px-4
                  py-3.5
                  text-sm
                  text-[#2c1810]
                  placeholder:text-[#5c3d2e]/40
                  outline-none
                  font-[EB_Garamond]
                  transition-all
                  duration-300
                  hover:border-[#c9a227]/60
                  focus:border-[#8b1a1a]
                  focus:ring-2
                  focus:ring-[#8b1a1a]/20
                  dark:bg-[#1a0f08]
                  dark:border-[#5c3d2e]
                  dark:text-[#f5ead6]
                  dark:placeholder:text-[#d4b896]/30
                  dark:focus:border-[#c9a227]
                  dark:focus:ring-[#c9a227]/20
                "
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5c3d2e] dark:text-[#d4b896] mb-2 font-[Cormorant_Garamond]">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="E.g., arthur@camelot.org"
                value={formData.email}
                onChange={changeHandler}
                className="
                  w-full
                  bg-[#fdf8f0]
                  border
                  border-[#d4b896]
                  rounded-lg
                  px-4
                  py-3.5
                  text-sm
                  text-[#2c1810]
                  placeholder:text-[#5c3d2e]/40
                  outline-none
                  font-[EB_Garamond]
                  transition-all
                  duration-300
                  hover:border-[#c9a227]/60
                  focus:border-[#8b1a1a]
                  focus:ring-2
                  focus:ring-[#8b1a1a]/20
                  dark:bg-[#1a0f08]
                  dark:border-[#5c3d2e]
                  dark:text-[#f5ead6]
                  dark:placeholder:text-[#d4b896]/30
                  dark:focus:border-[#c9a227]
                  dark:focus:ring-[#c9a227]/20
                "
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5c3d2e] dark:text-[#d4b896] mb-2 font-[Cormorant_Garamond]">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="What is your story about?"
                value={formData.subject}
                onChange={changeHandler}
                className="
                  w-full
                  bg-[#fdf8f0]
                  border
                  border-[#d4b896]
                  rounded-lg
                  px-4
                  py-3.5
                  text-sm
                  text-[#2c1810]
                  placeholder:text-[#5c3d2e]/40
                  outline-none
                  font-[EB_Garamond]
                  transition-all
                  duration-300
                  hover:border-[#c9a227]/60
                  focus:border-[#8b1a1a]
                  focus:ring-2
                  focus:ring-[#8b1a1a]/20
                  dark:bg-[#1a0f08]
                  dark:border-[#5c3d2e]
                  dark:text-[#f5ead6]
                  dark:placeholder:text-[#d4b896]/30
                  dark:focus:border-[#c9a227]
                  dark:focus:ring-[#c9a227]/20
                "
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5c3d2e] dark:text-[#d4b896] mb-2 font-[Cormorant_Garamond]">
                Your Message
              </label>
              <textarea
                rows={6}
                name="message"
                placeholder="Pen your thoughts here..."
                value={formData.message}
                onChange={changeHandler}
                className="
                  w-full
                  bg-[#fdf8f0]
                  border
                  border-[#d4b896]
                  rounded-lg
                  px-4
                  py-3.5
                  text-sm
                  text-[#2c1810]
                  placeholder:text-[#5c3d2e]/40
                  outline-none
                  resize-none
                  font-[EB_Garamond]
                  transition-all
                  duration-300
                  hover:border-[#c9a227]/60
                  focus:border-[#8b1a1a]
                  focus:ring-2
                  focus:ring-[#8b1a1a]/20
                  dark:bg-[#1a0f08]
                  dark:border-[#5c3d2e]
                  dark:text-[#f5ead6]
                  dark:placeholder:text-[#d4b896]/30
                  dark:focus:border-[#c9a227]
                  dark:focus:ring-[#c9a227]/20
                "
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                parchment-btn-primary
                w-full
                py-4
                font-bold
                tracking-widest
                transition-all
                duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-[Cormorant_Garamond] text-base">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-slate-400/30 dark:border-t-slate-900" />
                ) : (
                  <>
                    Send Message
                    <svg
                      className="w-4 h-4 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>

            {/* Success */}
            {success && (
              <div className="bg-[#8b1a1a]/5 border border-[#8b1a1a]/30 rounded-lg px-4 py-4 dark:bg-[#c9a227]/5 dark:border-[#c9a227]/30">
                <p className="text-[#8b1a1a] text-sm sm:text-base font-semibold text-center font-[EB_Garamond] dark:text-[#c9a227]">
                  ✓ Message sent successfully. I’ll get back to you soon.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-[#8b1a1a]/5 border border-[#8b1a1a]/30 rounded-lg px-4 py-4">
                <p className="text-[#8b1a1a] text-sm sm:text-base font-semibold text-center font-[EB_Garamond] dark:text-red-400">
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
