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
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
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
        navigate(from, { replace: true });
      }
    } catch {
      toast.error("Failed to login with Google. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed. Please try again.");
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

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center justify-items-center lg:justify-items-stretch relative z-10 box-border">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-center gap-6 w-full max-w-md mx-auto box-border"
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
              Join thousands of writers creating amazing content with our AI-powered storytelling platform.
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-3">
            <div className="flex items-start gap-4 rounded-2xl border border-violet-200/60 dark:border-violet-800/40 bg-violet-50 dark:bg-violet-950/40 p-4">
              <div className="mt-0.5 shrink-0 rounded-xl border border-white/80 bg-white dark:bg-slate-800/80 p-2 shadow-sm">
                <WandSparkles className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Smart AI Writing</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">AI that understands your creative style and helps you break through blocks.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/40 p-4">
              <div className="mt-0.5 shrink-0 rounded-xl border border-white/80 bg-white dark:bg-slate-800/80 p-2 shadow-sm">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Infinite Variations</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Generate multiple unique story branches from a single prompt.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-pink-200/60 dark:border-pink-800/40 bg-pink-50 dark:bg-pink-950/40 p-4">
              <div className="mt-0.5 shrink-0 rounded-xl border border-white/80 bg-white dark:bg-slate-800/80 p-2 shadow-sm">
                <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Community Driven</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Publish, get feedback, and collaborate with a thriving creative ecosystem.</p>
              </div>
            </div>
          </div>
        </motion.div>

                <div className="flex justify-center w-full box-border">
          <div className="w-full max-w-md overflow-hidden bg-slate-50 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl box-border overflow-hidden relative mx-auto">
            <button
              onClick={() => navigate("/")}
              className="mb-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              ← Back to Home
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Welcome back
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
                validation={{ required: "Email is required" }}
                error={errors.email}
                autoComplete="email"
              />

              <div>
                <SSInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  icon="fi fi-rr-lock"
                  register={register}
                  validation={{ required: "Password is required" }}
                  error={errors.password}
                  autoComplete="current-password"
                />

                <div className="flex justify-end pt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <SSButton text="Sign In" type="submit" isLoading={isBusy} />
              </div>
            </form>

            <div className="relative my-8 w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 dark:bg-slate-800 px-4 text-slate-400 font-semibold tracking-wide">
                  Or
                </span>
              </div>
            </div>

            <div className="flex justify-center w-full max-w-full overflow-x-hidden">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
              />
            </div>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default LoginComponent;
