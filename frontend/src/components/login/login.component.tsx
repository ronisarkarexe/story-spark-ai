import { useForm, SubmitHandler } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useState } from "react";
import {
  useLoginUserMutation,
  useGoogleLoginMutation,
} from "../../redux/apis/auth.api";
import { storeUserInfo, getUserInfo } from "../../services/auth.service";
import { USER_ROLE } from "../../constants/role";
import RedirectComponent from "../redirect.component";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

type Inputs = {
  email: string;
  password: string;
};

const LoginComponent = () => {
  const [loginUser] = useLoginUserMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const { register, handleSubmit } = useForm<Inputs>();

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsBusy(true);

    try {
      const res = await loginUser({ ...data }).unwrap();

      if (res.data.accessToken) {
        toast.success("User logged in successfully!");

        storeUserInfo({
          accessToken: res.data.accessToken,
        });

        setIsLoggedIn(true);
      }
    } catch (err: unknown) {
      console.log("error: ", err);

      toast.error(
        "Login failed. Please check your credentials."
      );
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
        toast.success(
          "User logged in successfully with Google!"
        );

        storeUserInfo({
          accessToken: res.data.accessToken,
        });

        setIsLoggedIn(true);
      }
    } catch (err: unknown) {
      console.log("Google login error: ", err);

      toast.error(
        "Failed to login with Google. Please try again."
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.log("Login Failed");

    toast.error(
      "Google login failed. Please try again."
    );
  };

  // Role-based redirect fix
  if (isLoggedIn) {
    const userInfo = getUserInfo();

    const isDashboardUser =
      userInfo?.role === USER_ROLE.ADMIN ||
      userInfo?.role === USER_ROLE.SUPER_ADMIN;

    return (
      <RedirectComponent
        defaultPath={
          isDashboardUser
            ? "/dashboard"
            : "/explore"
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center relative overflow-hidden px-4">

      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex w-full max-w-md flex-col justify-center py-12 relative z-10">

        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
            STORY SPARK AI
          </h2>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 sm:p-10 shadow-2xl">

            <button
            onClick={() => window.location.href = "/"}
            className="mb-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
                      >
            ← Back to Home
            </button>

          <h3 className="mb-6 text-center text-2xl font-bold tracking-tight text-slate-200">
            Welcome Back
          </h3>

          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >

            <SSInput
              label="Email address"
              name="email"
              type="email"
              placeholder="Enter your email"
              required={true}
              icon="fas fa-envelope"
              register={register}
            />

            <SSInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required={true}
              icon="fas fa-lock"
              register={register}
            />

            <SSButton
              text="Sign In"
              type="submit"
              isLoading={isBusy}
            />

          </form>

          <div className="mt-6 relative">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-400">
                OR
              </span>
            </div>

          </div>

          {/* Explicitly added list-none to prevent stray bullet point artifact on production build */}
          <div className="mt-6 flex justify-center list-none">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">

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

      <Toaster
        position="top-right"
        reverseOrder={false}
      />

    </div>
  );
};

export default LoginComponent;