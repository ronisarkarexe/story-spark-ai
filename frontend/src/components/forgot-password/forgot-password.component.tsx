import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/apis/auth.api";

const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            StorySparkAI
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Reset your password
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-green-100">
              <svg
                className="w-7 h-7 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Check your inbox
            </h2>

            <p className="text-sm text-gray-500">
              If an account exists for{" "}
              <span className="font-medium text-gray-700">
                {email}
              </span>
              , we've sent a password reset link.
            </p>

            <Link
              to="/login"
              className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              &larr; Back to login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <p className="text-sm text-gray-600 mb-4">
              Enter the email address associated with your account and
              we'll send you a link to reset your password.
            </p>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

              {error && (
                <p
                  className="mt-1 text-xs text-red-600"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
