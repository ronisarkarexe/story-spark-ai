import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { storeUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import {
  useEmailVerifyMutation,
  useVerifyOtpMutation,
} from "../../redux/apis/otp.verify.api";
import { useRegisterUserMutation } from "../../redux/apis/auth.api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { WandSparkles, BookOpen, UsersRound } from "lucide-react";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";

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
    length: (password?.length ?? 0) >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /[0-9]/.test(password || ""),
    special: /[^A-Za-z0-9]/.test(password || ""),
  };

  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
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
                Infinite Worlds.
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

        {/* Right Side: Form / OTP */}
        <section className="w-full md:w-[48%] flex items-center justify-center p-8 sm:p-12 bg-slate-50 dark:bg-slate-900/40 backdrop-blur-xl">
          <div className="w-full max-w-md">
            <button
              onClick={() => navigate("/")}
              className="mb-6 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              ← Back to Home
            </button>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {showOtpField ? "Verify OTP" : "Create Account"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              {showOtpField ? "Enter verification code sent to your email." : "Join StorySparkAI and begin your creative journey."}
            </p>

            {!showOtpField ? (
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                      message: "Only letters, numbers, spaces, underscores, and dots are allowed",
                    },
                  }}
                  error={errors.name}
                />

                <SSInput
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="name@storyspark.ai"
                  required={true}
                  icon="fi fi-rr-envelope"
                  register={register}
                  autoComplete="email"
                  validation={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  }}
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
                  autoComplete="new-password"
                  validation={{
                    required: "Password is required",
                    validate: (value) => getPasswordError(value) || true,
                  }}
                  error={errors.password}
                />

                {password && (
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${barColor} ${barWidth}`}
                      />
                    </div>
                    <p className={`text-sm font-medium ${textColor}`}>
                      Password Strength: {strengthLabel}
                    </p>
                    <div className="space-y-1 mt-3 font-semibold">
                      {PASSWORD_REQUIREMENTS.map((rule) => (
                        <p
                          key={rule.key}
                          className={`text-xs ${
                            passwordChecks[rule.key]
                              ? "text-green-500"
                              : "text-slate-400 dark:text-slate-500"
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
                  validation={{
                    required: "Confirm password is required",
                    validate: (value) => value === password || "Passwords do not match",
                  }}
                  error={errors.confirmPassword}
                />

                <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
              </form>
            ) : (
              <form className="space-y-5 w-full" onSubmit={(e) => { e.preventDefault(); handleOtpValidation(); }}>
                <SSInput
                  label="OTP Code"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
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

                <SSButton text="Verify OTP" type="submit" isLoading={isBusy} />

                <div className="flex flex-col items-center gap-2 mt-4 font-semibold">
                  <button
                    type="button"
                    disabled={cooldown > 0 || isBusy}
                    onClick={handleResendOtp}
                    className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline disabled:text-slate-400 disabled:no-underline"
                  >
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtpField(false)}
                    className="text-xs text-slate-400 hover:text-slate-300 underline"
                  >
                    Change Email / Info
                  </button>
                </div>
              </form>
            )}

            {!showOtpField && (
              <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignUpComponent;
