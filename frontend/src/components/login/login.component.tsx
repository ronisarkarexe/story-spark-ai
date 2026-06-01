import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
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
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-[#050816] dark:bg-[#050816] bg-white text-black dark:text-white transition-all duration-300 relative overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="auth-container flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/10 dark:border-white/10 border-black/10 shadow-[0_0_40px_rgba(168,85,247,0.12)] w-full max-w-6xl bg-white dark:bg-[#0b1020] relative z-10">
        
        {/* Left Side: Brand & Hero */}
        <section className="relative hidden md:flex md:w-[52%] flex-col justify-between p-12 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0,transparent_60%)]"></div>
          
          <div className="relative z-10">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="fi fi-rr-sparkles text-white text-sm"></span>
              </div>
              <span className="text-white text-sm tracking-[0.25em] font-bold uppercase">
                Story Spark AI
              </span>
            </div>
            
            {/* Hero Text */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-white drop-shadow-xl">
              One Spark.
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-orange-200 bg-clip-text text-transparent">
                Infinite Stories.
              </span>
            </h1>
            
            <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-md font-medium">
              Turn your imagination into fully illustrated multi-variation AI stories.
            </p>
          </div>

          <div className="relative z-10 mt-12 flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <WandSparkles className="text-purple-400 shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-white text-sm">Smart Writing</h4>
                <p className="text-xs text-white/60">AI that understands and adapts to your ideas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <BookOpen className="text-pink-400 shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-white text-sm">Endless Creativity</h4>
                <p className="text-xs text-white/60">Generate multiple story arcs and styles</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <UsersRound className="text-orange-400 shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-white text-sm">Built for Everyone</h4>
                <p className="text-xs text-white/60">Writers, creators, and dreamers alike</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full md:w-[48%] flex items-center justify-center p-8 sm:p-12 bg-slate-50 dark:bg-slate-900/40 backdrop-blur-xl">
          <div className="w-full max-w-md">
            <button
              onClick={() => navigate("/")}
              className="mb-6 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              ← Back to Home
            </button>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Sign in to continue generating stories.
            </p>

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
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <SSButton
                text="Sign In"
                type="submit"
                isLoading={isBusy}
              />
            </form>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                  OR
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
              />
            </div>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginComponent;