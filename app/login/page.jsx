"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, LogIn, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useUser } from "@/app/contexts/UserContext";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false },
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const router = useRouter();
  const { setUser } = useUser();

  const handleAuth = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!captchaToken) throw new Error("Please complete captcha");

      if (isLogin) {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            captchaToken,
            action: "login",
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Login failed");

        // The API route set the session as cookies.
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user || null);
        router.push("/dashboard");
      } else {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            captchaToken,
            action: "signup",
            name,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Signup failed");
        toast.success(data.message || "Account created! Please sign in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-udemy-surface dark:bg-udemy-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-udemy-dark-surface rounded-xl shadow-lg overflow-hidden border border-udemy-border dark:border-udemy-dark-border"
      >
        {/* Header */}
        <div className="bg-udemy-purple p-6 text-white">
          <div className="mb-4 text-white hover:text-white/80 hover:-translate-x-1 transition cursor-pointer">
            <Link
              href="/"
            >
            ← Back To Home
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-purple-200 text-sm mt-1">
              {isLogin
                ? "Sign in to access your dashboard"
                : "Join us to get started"}
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center p-6">
          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg border border-udemy-border dark:border-udemy-dark-border bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text font-medium hover:bg-udemy-surface dark:hover:bg-udemy-dark-bg duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="/google.webp" width={24} alt="" aria-hidden="true" />
            <span className="mx-2">Continue with Google</span>
          </button>
        </div>

        <div className="relative flex items-center px-6">
          <div className="flex-grow border-t border-udemy-border dark:border-udemy-dark-border"></div>
          <span className="flex-shrink mx-4 text-udemy-muted dark:text-udemy-dark-muted">
            or
          </span>
          <div className="flex-grow border-t border-udemy-border dark:border-udemy-dark-border"></div>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              id="error-message"
              role="alert"
              className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3 rounded"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} noValidate className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="email"
                aria-label="Email address"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="password"
                aria-label="Password"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  aria-label="Full name"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {/* Turnstile for both login and signup */}
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={(token) => setCaptchaToken(token)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !captchaToken}
              className={`w-full flex items-center justify-center py-3 px-4 rounded text-white font-bold transition-all ${
                loading
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-udemy-purple hover:bg-udemy-purple-dark shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isLogin ? (
                <>
                  <LogIn size={18} className="mr-2" /> Continue
                </>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" /> Continue
                </>
              )}
            </button>
          </form>

          {/* Switch forms */}
          <div className="text-center text-sm text-udemy-muted dark:text-udemy-dark-muted">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-udemy-purple dark:text-udemy-purple-light hover:underline font-semibold"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-udemy-purple dark:text-udemy-purple-light hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          <div className="text-center text-xs text-udemy-muted dark:text-udemy-dark-muted mt-6">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-udemy-purple dark:text-udemy-purple-light hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-udemy-purple dark:text-udemy-purple-light hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
