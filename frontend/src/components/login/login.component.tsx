import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { motion } from "framer-motion";

import {
  useLoginUserMutation,
  useGoogleLoginMutation,
} from "../../redux/apis/auth.api";
import { storeUserInfo } from "../../services/auth.service";
import RedirectComponent from "../redirect.component";

import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { WandSparkles, BookOpen, UsersRound } from "lucide-react";

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

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsBusy(true);
    try {
      const res = await loginUser({ ...data }).unwrap();
      if (res.data.accessToken) {
        toast.success("User logged in successfully!");
        storeUserInfo({ accessToken: res.data.accessToken });
        setIsLoggedIn(true);
      }
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    setIsBusy(true);
    try {
      const res = await googleLogin({
        token: credentialResponse.credential,
      }).unwrap();
      if (res.data.accessToken) {
        toast.success("User logged in successfully with Google!");
        storeUserInfo({
          accessToken: res.data.accessToken,
        });
        setIsLoggedIn(true);
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

  if (isLoggedIn) {
    return (
      <RedirectComponent
        defaultPath="/dashboard"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex items-center justify-center relative overflow-hidden p-4 sm:p-8 box-border">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Grid Layout Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10 box-border">
        {/* Left Column — Informational Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col justify-center gap-6 w-full max-w-md mx-auto box-border"
        >
          <div className="text-left mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-3">
              Turns ideas into unforgettable stories
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              AI powered storytelling that helps you create, connect & inspire.
            </p>
          </div>

          <div className="flex items-center gap-4 border border-gray-300 dark:border-slate-700/50 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
            <WandSparkles className="text-violet-600 shrink-0" />
            <div className="text-left">
              <h2 className="font-bold">Smart writing</h2>
              <p className="text-sm text-slate-500">AI that understands your ideas</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border border-gray-300 dark:border-slate-700/50 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
            <BookOpen className="text-violet-600 shrink-0" />
            <div className="text-left">
              <h2 className="font-bold">Endless Creativity</h2>
              <p className="text-sm text-slate-500">Stories that captivate and inspire</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border border-gray-300 dark:border-slate-700/50 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
            <UsersRound className="text-violet-600 shrink-0" />
            <div className="text-left">
              <h2 className="font-bold">Built for everyone</h2>
              <p className="text-sm text-slate-500">Writers, Creators and dreamers</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column — Login Form Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center w-full box-border"
        >
          <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 sm:p-10 shadow-2xl box-border overflow-hidden relative">
            {/* Back to Home */}
            <button
              onClick={() => (window.location.href = "/")}
              className="mb-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 cursor-pointer border-none bg-transparent"
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

            <form className="space-y-5 w-full min-w-0 box-border text-left" onSubmit={handleSubmit(onSubmit)}>
              <SSInput
                label="Email address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required={true}
                icon="fi fi-rr-envelope"
                register={register}
                validation={{ required: "Email is required" }}
                error={errors.email}
                autoComplete="email"
              />

              <SSInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required={true}
                icon="fi fi-rr-lock"
                register={register}
                validation={{ required: "Password is required" }}
                error={errors.password}
                autoComplete="password"
              />

              <div className="flex justify-end -mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
              </div>

              <SSButton text="Sign In" type="submit" isLoading={isBusy} />
            </form>

            <div className="mt-6 relative w-full flex items-center justify-center">
              <div className="absolute inset-0 flex items-center w-full">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <span className="relative z-10 px-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                OR
              </span>
            </div>

            <div className="mt-6 flex justify-center w-full box-border">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
              />
            </div>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default LoginComponent;