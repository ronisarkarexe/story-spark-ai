import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import "./auth.css";

import "@flaticon/flaticon-uicons/css/all/all.css";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-white px-4 text-slate-900 box-border dark:bg-[#0B1120] dark:text-slate-100">

      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl py-12">
        <div className="mb-10">
          <h2 className="text-center text-4xl font-extrabold tracking-tight drop-shadow-sm sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
            STORY SPARK AI
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-5 lg:pt-6">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-500">
              Turns Ideas into
              <br />
              unforgettable stories
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              AI powered storytelling that helps you create, connect, and inspire.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700/50 dark:bg-slate-800/60 dark:text-slate-300">
                <WandSparkles className="mt-0.5 text-violet-600 dark:text-violet-400" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Smart writing
                  </p>
                  <p className="text-sm">AI that understands your ideas</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700/50 dark:bg-slate-800/60 dark:text-slate-300">
                <BookOpen className="mt-0.5 text-violet-600 dark:text-violet-400" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Endless creativity
                  </p>
                  <p className="text-sm">Stories that captivate and inspire</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700/50 dark:bg-slate-800/60 dark:text-slate-300 sm:col-span-2">
                <UsersRound className="mt-0.5 text-violet-600 dark:text-violet-400" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Built for everyone
                  </p>
                  <p className="text-sm">Writers, creators, and dreamers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full min-w-0">
            <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60 sm:p-10">
          <img
            src="src/assets/login.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

            <button
            onClick={() => window.location.href = "/"}
            className="mb-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
            >
            ← Back to Home
          </button>


          <div className="absolute inset-0 bg-black/60"></div>

          <form
            className="space-y-5 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
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
              />

            <div className="flex justify-end -mt-2">
              <a
                href="/forgot-password"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                Forgot Password?
              </a>
            </div>

            <SSButton
              text="Sign In"
              type="submit"
              isLoading={isBusy}
              />
          </form>

          <div className="mt-6 relative w-full">
            <div className="absolute inset-0 flex items-center w-full">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
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
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </div>

    <Toaster
      position="top-right"
      reverseOrder={false}
    />

  </div>
</div>
  );
};

export default LoginComponent;
