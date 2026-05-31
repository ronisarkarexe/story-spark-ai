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

      <div className="flex w-full flex-col justify-center py-12 relative z-10">

        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
            STORY SPARK AI
          </h2>
        </div>
        <div className="flex justify-center items-center gap-40">

        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-700 bg-clip-text text-transparent">
            
            Turns Ideas into
            <br /> 
            unforgotable stories
            
            </h1>
          <p>AI powered storytelling that helps you
              <br />            
             create connect inspire.</p>

             <div className="flex justify-center items-center gap-6 border border-gray-300 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-gray-400">
              <div>
                <WandSparkles className="text-violet-600"/>
              </div>
              <div>
                <h1 className="font-bold">Smart writing</h1>
                <p>AI that understands your ideas</p>
              </div>
             </div>


             <div className="flex justify-center items-center gap-6 border border-gray-300 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-gray-400">
              <div>
                <BookOpen className="text-violet-600"/>
              </div>
              <div>
                <h1 className="font-bold">Endless Creativity</h1>
                <p>Stories that captivate and inspire</p>
              </div>
             </div>


             <div className="flex justify-center items-center gap-6 border border-gray-300 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-gray-400">
              <div>
                <UsersRound className="text-violet-600"/>
              </div>
              <div>
                <h1 className="font-bold">Built for everyone</h1>
                <p>Writers, Creaters and dreamers</p>
              </div>
             </div>
             <div className="border border-gray-300 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-gray-400">
                Create, edit, and generate engaging multiple story
                <br />
                 variations from a single prompt.
                  <br />                
                 Perfect for writers, creators, and enthusiasts 
                 <br />
                 exploring the future of fiction.
             </div>
        </div>


        <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 sm:p-10 shadow-2xl overflow-hidden">

            <button
            onClick={() => window.location.href = "/"}
            className="mb-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
            >
            ← Back to Home
          </button>


          <h3 className="mb-6 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
            Welcome Back
          </h3>

          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            >

          {/* Added w-full to the form */}

          <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
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

            <SSButton text="Sign In" type="submit" isLoading={isBusy} />
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

      <Toaster
        position="top-right"
        reverseOrder={false}
        />

    </div>
        </div>
  );
};

export default LoginComponent;