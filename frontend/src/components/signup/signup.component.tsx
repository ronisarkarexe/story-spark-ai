import { useForm, SubmitHandler } from "react-hook-form";

import { useState, useEffect } from "react";
import { storeUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import {
  useEmailVerifyMutation,
  useVerifyOtpMutation,
} from "../../redux/apis/otp.verify.api";
import { useRegisterUserMutation } from "../../redux/apis/auth.api";
import { WandSparkles, BookOpen, UsersRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface IRegisterInfo {
  name: string;
  email: string;
  password: string;
}

interface Inputs extends IRegisterInfo {
  confirmPassword: string;
  otp: string;
}

const getPasswordError = (password: string) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return "";
};

type StrengthLevel = "weak" | "medium" | "strong";

const PASSWORD_STRENGTH_CONFIG: Record<
  StrengthLevel,
  { label: string; barColor: string; barWidth: string; textColor: string }
> = {
  weak: {
    label: "Weak",
    barColor: "bg-red-500",
    barWidth: "w-1/3",
    textColor: "text-red-400",
  },
  medium: {
    label: "Medium",
    barColor: "bg-yellow-400",
    barWidth: "w-2/3",
    textColor: "text-yellow-300",
  },
  strong: {
    label: "Strong",
    barColor: "bg-green-500",
    barWidth: "w-full",
    textColor: "text-green-400",
  },
};

const getStrengthLevel = (passedChecks: number): StrengthLevel => {
  if (passedChecks <= 2) return "weak";
  if (passedChecks <= 4) return "medium";
  return "strong";
};

const PASSWORD_REQUIREMENTS = [
  { key: "length" as const, label: "Minimum 8 characters" },
  { key: "uppercase" as const, label: "One uppercase letter" },
  { key: "lowercase" as const, label: "One lowercase letter" },
  { key: "number" as const, label: "One number" },
  { key: "special" as const, label: "One special character" },
];

const SignUpComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [emailVerify] = useEmailVerifyMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [registerUser] = useRegisterUserMutation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [showOtpField, setShowOtpField] = useState<boolean>(false);
  const [registerInfo, setRegisterInfo] = useState<IRegisterInfo>();
  const [expiredAt, setExpiredAt] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const otp = watch("otp");
  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /[0-9]/.test(password || ""),
    special: /[^A-Za-z0-9]/.test(password || ""),
  };

  const passedChecks =
    Object.values(passwordChecks).filter(Boolean).length;

  const strengthLevel = getStrengthLevel(passedChecks);
  const { label: strengthLabel, barColor, barWidth, textColor } =
    PASSWORD_STRENGTH_CONFIG[strengthLevel];

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data) {
      const user = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const otpPayload = {
        name: data.name,
        email: data.email,
      };
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      const passwordError = getPasswordError(data.password);
      if (passwordError) {
        toast.error(passwordError);
        return;
      }
      setIsBusy(true);
      try {
        const res = await emailVerify({ ...otpPayload }).unwrap();
        if (res?.data) {
          const { expiresAt } = res.data;
          setExpiredAt(new Date(expiresAt).getTime());
          toast.success("OTP sent to your email");
          setRegisterInfo(user);
          setShowOtpField(true);
          setCooldown(60);
        }
      } catch (error) {
        const message =
          (error as { data?: Array<{ message?: string }> })?.data?.[0]
            ?.message ||
          "Failed to send OTP. Check backend .env email credentials.";
        toast.error(message);
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleOtpValidation = async () => {
    const enteredOtp = otp?.trim();
    if (!enteredOtp) {
      toast.error("Please enter OTP");
      return;
    }
    if (!registerInfo) {
      toast.error("Something went wrong. Please restart the process.");
      return;
    }
    if (Date.now() > expiredAt) {
      toast.error("OTP expired. Please request a new one.");
      return;
    }
    setIsBusy(true);
    try {
      const otpResponse = await verifyOtp({
        email: registerInfo.email,
        otp: enteredOtp,
      }).unwrap();

      if (otpResponse?.data?.verificationToken) {
        const res = await registerUser({
          ...registerInfo,
          verificationToken: otpResponse.data.verificationToken,
        }).unwrap();

        if (res.data.accessToken) {
          toast.success("OTP validated successfully!");
          storeUserInfo({ accessToken: res.data.accessToken });
          const redirectPath = location.state && location.state.from ? location.state.from : "/";
          navigate(redirectPath);
        }
      } else {
        throw new Error("No verification token received");
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: Array<{ message?: string }> })?.data?.[0]?.message ||
        "OTP verification failed. Please check the code and try again.";
      toast.error(message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || isBusy) return;
    if (!registerInfo) {
      toast.error("Something went wrong. Please restart the process.");
      return;
    }
    setIsBusy(true);
    try {
      const otpPayload = {
        name: registerInfo.name,
        email: registerInfo.email,
      };
      const res = await emailVerify({ ...otpPayload }).unwrap();
      if (res?.data) {
        const { expiresAt } = res.data;
        setExpiredAt(new Date(expiresAt).getTime());
        toast.success("OTP resent successfully!");
        setValue("otp", "");
        setCooldown(60);
      }
    } catch (error) {
      const message =
        (error as { data?: Array<{ message?: string }> })?.data?.[0]
          ?.message || "Failed to resend OTP. Please try again.";
      toast.error(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-[#050816] dark:bg-[#050816] bg-white text-black dark:text-white transition-all duration-300">

      <main className="auth-container flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/10 dark:border-white/10 border-black/10 shadow-[0_0_40px_rgba(168,85,247,0.12)] w-full max-w-6xl bg-white dark:bg-[#0b1020]">

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
        
        <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 sm:p-10 shadow-2xl">
          <h3 className="text-center text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
            {showOtpField ? "Verify Your Email" : "Create Account"}
          </h3>

          {!showOtpField && (
            <p className="mt-2 mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Join StorySparkAI and begin your creative journey.
            </p>
          )}
          <body className="overflow-x-hidden"></body>
          {!showOtpField && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
             <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-400 font-semibold">
                  SIGN UP WITH EMAIL
                </span>
              </div>
            </div>
          )}

          {!showOtpField ? (

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate> 

            <form className="space-y-5 w-full max-w-full min-w-0" onSubmit={handleSubmit(onSubmit)}>

              <SSInput
                label="Name"
                name="name"
                placeholder="Enter your name"
                required={true}
                icon="fi fi-rr-user"
                register={register}
                autoComplete="name"
                validation={{
                  required: "Name is required",
                minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
                },
                  pattern: {
                    value: /^[A-Za-z0-9\s._]+$/,
                    message:
                      "Only letters, numbers, spaces, underscores, and dots are allowed",
                  },
                }}
              />
            ))}

          </div>

          {/* Content */}

          <div className="relative z-10 px-8 md:px-14">

            {/* Brand */}

            <div className="flex items-center gap-3 mb-8">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">

                <span className="fi fi-rr-sparkles text-white text-sm"></span>

              </div>

              <span className="text-white text-sm tracking-[0.25em] font-bold uppercase">

                Story Spark AI

              </span>

            </div>

            {/* Hero Text */}

            <h1 className="text-4xl md:text-6xl font-black leading-[0.95] text-white drop-shadow-xl">

              One Spark.
              <br />

              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-orange-200 bg-clip-text text-transparent">

                Infinite Worlds.

              </span>

            </h1>

            <p className="mt-6 text-white/90 text-lg leading-relaxed max-w-xl font-medium">

              Turn your imagination into fully illustrated
              multi-variation AI stories.

            </p>

          </div>

        </section>

        {/* RIGHT SIDE */}

        <section className="w-full md:w-[48%] flex items-center justify-center p-4 md:p-6 bg-white dark:bg-[#050816]">

          <div className="w-full max-w-[470px] rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#09111f]/80 backdrop-blur-xl p-7 md:p-9 shadow-xl">

            {/* Heading */}

            <div className="mb-7">

              <h2 className="text-4xl font-black text-black dark:text-white">

                Create Account

              </h2>

              <p className="mt-2 text-[16px] text-gray-600 dark:text-gray-400">

                Join StorySparkAI and begin your creative journey.

              </p>

            </div>

            {/* Login Header */}

            <div className="border-b border-black/10 dark:border-white/10 mb-8">

              <button className="w-full pb-4 text-base font-bold tracking-widest text-purple-500 border-b-2 border-purple-500">

                Sing Up

              </button>

            </div>

            {/* FORM */}

            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >

              {/* NAME */}

              <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">

                  Full Name

                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full h-[52px] rounded-2xl border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#131c2f] px-5 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 outline-none focus:border-purple-500 transition-all"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />

                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}

              </div>

              {/* EMAIL */}

              <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">

                  Email Address

                </label>

                <input
                  type="email"
                  placeholder="name@storyspark.ai"
                  className="w-full h-[52px] rounded-2xl border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#131c2f] px-5 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 outline-none focus:border-purple-500 transition-all"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">

                  Password

                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full h-[52px] rounded-2xl border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#131c2f] px-5 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 outline-none focus:border-purple-500 transition-all"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">

                  Confirm Password

                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full h-[52px] rounded-2xl border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#131c2f] px-5 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 outline-none focus:border-purple-500 transition-all"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                  })}
                />

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}

              </div>
{/* PASSWORD STRENGTH */}

{password && (
  <div className="space-y-2">

    <div className="h-2 rounded-full bg-white/10 overflow-hidden">

      <div
        className={`h-full transition-all duration-300 ${barColor} ${barWidth}`}
      />

    </div>

    <p className={`text-sm font-medium ${textColor}`}>
      Password Strength: {strengthLabel}
    </p>

    <div className="space-y-1 mt-3">

      {PASSWORD_REQUIREMENTS.map((rule) => (
        <p
          key={rule.key}
          className={`text-xs ${
            passwordChecks[rule.key]
              ? "text-green-400"
              : "text-gray-400"
          }`}
        >
          • {rule.label}
        </p>
      ))}

    </div>

  </div>
)}

              <SSInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required={true}
                icon="fi fi-rr-lock" 
                register={register}
                autoComplete="new-password"
                error={errors.confirmPassword}
              />

              <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
            </form>
          ) : (
            <div className="space-y-5 w-full max-w-full min-w-0">
              <SSInput
                label="OTP"
                name="otp"
                placeholder="Enter your OTP"
                required={true}
                icon="fi fi-rr-key"
                register={register}
                validation={{
                  required: "Please enter OTP",
                  minLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                  maxLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "OTP must contain only numbers",
                  },
                }}
                error={errors.otp}
              />

    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
      OTP Code
    </label>

    <input
      type="text"
      placeholder="Enter OTP"
      className="w-full h-[52px] rounded-2xl border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#131c2f] px-5 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 outline-none focus:border-purple-500 transition-all"
      {...register("otp")}
    />

          {!showOtpField && (
            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Sign In
              </a>
            </p>
          )}
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
    </div>
  );
};

export default SignUpComponent;
