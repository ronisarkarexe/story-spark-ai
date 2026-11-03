import { useState, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { motion } from "framer-motion";
import {
  useLoginUserMutation,
  useGoogleLoginMutation,
} from "../../redux/apis/auth.api";
import AuthContext from "../auth.context";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { WandSparkles } from "lucide-react";

type Inputs = {
  email: string;
  password: string;
};

type LoginError = {
  data?: {
    message?: string;
  };
  message?: string;
};

const LoginComponent = () => {
  const [loginUser] = useLoginUserMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });

  const { login } = useContext(AuthContext) ?? { login: () => {} };
  const [isBusy, setIsBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsBusy(true);
    try {
      const res = await loginUser(data).unwrap();

      if (res.data.accessToken) {
        toast.success("User logged in successfully!");
        login(res.data.accessToken);
        const from = location.state?.from || "/dashboard";
        navigate(from, { replace: true });
      }
    } catch (error: unknown) {
      const loginError = error as LoginError;

      toast.error(
        loginError.data?.message ||
          loginError.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setIsBusy(true);

    try {
      const res = await googleLogin({
        token: credentialResponse.credential,
      }).unwrap();

      if (res.data.accessToken) {
        toast.success("User logged in successfully with Google!");
        login(res.data.accessToken);
        const from = location.state?.from || "/dashboard";
        try {
          navigate(from, { replace: true });
        } catch (error) {
          console.error("Navigation after login failed", error);
          window.location.href = from;
        }
      }
    } catch (error) {
      console.error("Google login failed", error);
      toast.error("Failed to login with Google. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginError = () => {
    setIsBusy(false);
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      toast.error("Local configuration missing: VITE_GOOGLE_CLIENT_ID not found in .env.", { duration: 6000 });
    } else {
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen min-h-dvh w-full bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex items-center justify-center relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8 box-border">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center justify-items-center md:justify-items-stretch relative z-10 box-border">
        {/* Mobile/Tablet Header Title */}
        <div className="block md:hidden text-center w-full max-w-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
            STORY SPARK AI
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex flex-col justify-center gap-6 w-full max-w-md mx-auto box-border"
        >
          {/* Brand headline */}
          <div className="mb-1">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Your stories,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                reimagined with AI.
              </span>
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Join thousands of writers creating amazing content with our
              AI-powered storytelling platform.
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-3">
            <div className="flex items-start gap-4 rounded-2xl border border-violet-200/60 dark:border-violet-800/40 bg-violet-50 dark:bg-violet-950/40 p-4">
              <div className="mt-0.5 shrink-0 rounded-xl border border-white/80 bg-white dark:bg-slate-800/80 p-2 shadow-sm">
                <WandSparkles className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Smart AI Writing
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  AI that understands your creative style and helps you break
                  through blocks.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/40 p-4">
              <div className="mt-0.5 shrink-0 rounded-xl border border-white/80 bg-white dark:bg-slate-800/80 p-2 shadow-sm">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Infinite Variations
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Generate multiple unique story branches from a single prompt.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-pink-200/60 dark:border-pink-800/40 bg-pink-50 dark:bg-pink-950/40 p-4">
              <div className="mt-0.5 shrink-0 rounded-xl border border-white/80 bg-white dark:bg-slate-800/80 p-2 shadow-sm">
                <svg
                  className="w-5 h-5 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Community Driven
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Publish, get feedback, and collaborate with a thriving
                  creative ecosystem.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center w-full min-w-0 box-border">
          <div className="w-full max-w-md overflow-hidden bg-slate-50 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl box-border overflow-hidden relative mx-auto">
            <button
              onClick={() => navigate("/")}
              className="mb-4 text-sm font-semibold text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Home
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Welcome Back
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Sign in to your Story Spark AI account
              </p>
            </div>

            <form
              className="space-y-5 w-full min-w-0 box-border"
              onSubmit={handleSubmit(onSubmit)}
            >
              <SSInput
                label="Email address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                icon="fi fi-rr-envelope"
                register={register}
                validation={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                }}
                error={errors.email}
                autoComplete="email"
              />

              <div className="w-full min-w-0">
                <SSInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  icon="fi fi-rr-lock"
                  register={register}
                  validation={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  }}
                  error={errors.password}
                  autoComplete="current-password"
                />

                <div className="flex justify-end pt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors focus:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <SSButton
                  text="Sign In"
                  type="submit"
                  isLoading={isBusy}
                  disabled={isBusy}
                />
              </div>
            </form>

            <div className="relative my-6 w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-800 px-4 text-slate-400 font-semibold tracking-wide rounded-md">
                  Or
                </span>
              </div>
            </div>

            <div
              className={`flex justify-center w-full max-w-full overflow-x-hidden ${
                isBusy ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                />
              ) : (
                <div
                  className="flex items-center justify-center gap-3 w-[250px] px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-75"
                  title="Google Login requires VITE_GOOGLE_CLIENT_ID in your .env configuration."
                >
                  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-sm font-semibold">Google Auth Offline</span>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                Sign up for free
              </Link>
            </p>
            <div className="mt-3 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 inline-flex items-center gap-2 cursor-pointer">
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default LoginComponent;
