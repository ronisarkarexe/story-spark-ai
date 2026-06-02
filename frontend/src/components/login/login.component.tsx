import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import {
  useLoginUserMutation,
  useGoogleLoginMutation,
} from "../../redux/apis/auth.api";
import { storeUserInfo, getUserInfo } from "../../services/auth.service";
import { USER_ROLE } from "../../constants/role";
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
    const userInfo = getUserInfo();
    const isDashboardUser =
      userInfo?.role === USER_ROLE.ADMIN ||
      userInfo?.role === USER_ROLE.SUPER_ADMIN;
    return (
      <RedirectComponent
        defaultPath={isDashboardUser ? "/dashboard" : "/explore"}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex items-center justify-center relative overflow-hidden px-4 box-border">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex w-full max-w-5xl flex-row justify-center gap-16 py-12 relative z-10 box-border items-center">
        {/* Left side — feature highlights */}
        <div className="hidden lg:flex flex-col gap-5 max-w-sm">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-700 bg-clip-text text-transparent">
            Turns Ideas into
            <br />
            unforgettable stories
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            AI powered storytelling that helps you
            <br />
            create, connect &amp; inspire.
          </p>

          <div className="flex justify-center items-center gap-6 border border-gray-300 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 dark:text-gray-400">
            <WandSparkles className="text-violet-600 shrink-0" />
            <div>
              <h2 className="font-bold">Smart writing</h2>
              <p>AI that understands your ideas</p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-6 border border-gray-300 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 dark:text-gray-400">
            <BookOpen className="text-violet-600 shrink-0" />
            <div>
              <h2 className="font-bold">Endless Creativity</h2>
              <p>Stories that captivate and inspire</p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-6 border border-gray-300 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 dark:text-gray-400">
            <UsersRound className="text-violet-600 shrink-0" />
            <div>
              <h2 className="font-bold">Built for everyone</h2>
              <p>Writers, Creators and dreamers</p>
            </div>
          </div>

          <div className="border border-gray-300 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-gray-400 text-sm">
            Create, edit, and generate engaging multiple story variations from a
            single prompt. Perfect for writers, creators, and enthusiasts
            exploring the future of fiction.
          </div>
        </div>

        {/* Right side — login form card */}
        <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 sm:p-10 shadow-2xl">
          {/* Back to Home */}
          <button
            onClick={() => (window.location.href = "/")}
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

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

            {/* Password field — eye icon toggle is provided by SSInput when type="password" */}
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

          <div className="mt-6 relative w-full">
            <div className="absolute inset-0 flex items-center w-full">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm w-full">
              <span className="px-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                OR
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center list-none w-full">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default LoginComponent;
