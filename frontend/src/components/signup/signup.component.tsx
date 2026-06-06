import { useForm, SubmitHandler } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useState, useEffect } from "react";
import { storeUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import {
  useEmailVerifyMutation,
  useVerifyOtpMutation,
} from "../../redux/apis/otp.verify.api";
import { useRegisterUserMutation } from "../../redux/apis/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

interface IRegisterInfo {
  name: string;
  email: string;
  password: string;
}

interface Inputs extends IRegisterInfo {
  confirmPassword: string;
  otp: string;
}

type StrengthLevel = "weak" | "medium" | "strong";

const PASSWORD_STRENGTH_CONFIG: Record
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

  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const strengthLevel = getStrengthLevel(passedChecks);
  const { label: strengthLabel, barColor, barWidth, textColor } =
    PASSWORD_STRENGTH_CONFIG[strengthLevel];

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const user = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    const otpPayload = {
      name: data.name,
      email: data.email,
    };

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
        (error as { data?: Array<{ message?: string }> })?.data?.[0]?.message ||
        "Failed to send OTP. Check backend .env email credentials.";
      toast.error(message);
    } finally {
      setIsBusy(false);
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
          toast.success("Registration successful! Welcome to Story Spark AI!");
          storeUserInfo({ accessToken: res.data.accessToken });
          navigate("/explore");
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
      const res = await emailVerify({
        name: registerInfo.name,
        email: registerInfo.email,
      }).unwrap();
      if (res?.data) {
        const { expiresAt } = res.data;
        setExpiredAt(new Date(expiresAt).getTime());
        toast.success("OTP resent successfully!");
        setValue("otp", "");
        setCooldown(60);
      }
    } catch (error) {
      const message =
        (error as { data?: Array<{ message?: string }> })?.data?.[0]?.message ||
        "Failed to resend OTP. Please try again.";
      toast.error(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex items-center justify-center relative overflow-x-hidden px-4 py-8 box-border">
      {/* Background Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute bottom-[-10%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-full max-w-md flex-col justify-center gap-4 relative z-10"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
            STORY SPARK AI
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create your account and start your creative journey
          </p>
        </div>

        {/* Card */}
        <div className="w-full bg-slate-50 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 sm:p-10 shadow-2xl">

          {/* Back to Home — only on registration step */}
          {!showOtpField && (
            <button
              onClick={() => (window.location.href = "/")}
              className="mb-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              ← Back to Home
            </button>
          )}

          <h3 className="text-center text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200 mb-6">
            {showOtpField ? "Verify Your Email" : "Create Account"}
          </h3>

          {!showOtpField && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-50 dark:bg-slate-800/60 px-3 text-slate-500 dark:text-slate-400 font-semibold text-xs tracking-wider uppercase">
                  Sign up with email
                </span>
              </div>
            </div>
          )}

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
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9\s._]+$/,
                    message:
                      "Only letters, numbers, spaces, underscores, and dots are allowed",
                  },
                }}
                error={errors.name}
              />

              <SSInput
                label="Email address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required={true}
                icon="fi fi-rr-envelope"
                register={register}
                autoComplete="email"
                validation={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
                  validate: (value: string) => {
                    if (value.length < 8) return "Password must be at least 8 characters long";
                    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
                    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
                    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
                    if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character";
                    return true;
                  },
                }}
                error={errors.password}
              />

              {password?.length > 0 && (
                <div className="space-y-3 -mt-2">
                  <div
                    className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={passedChecks}
                    aria-valuemin={0}
                    aria-valuemax={PASSWORD_REQUIREMENTS.length}
                    aria-label="Password strength"
                  >
                    <div
                      className={`h-full transition-all duration-300 ${barColor} ${barWidth}`}
                    ></div>
                  </div>
                  <p className={`text-sm font-medium ${textColor}`} aria-live="polite">
                    {strengthLabel} Password
                  </p>
                  <ul className="space-y-1 text-xs">
                    {PASSWORD_REQUIREMENTS.map(({ key, label }) => {
                      const met = passwordChecks[key];
                      return (
                        <li
                          key={key}
                          className={met ? "text-green-400" : "text-red-400"}
                          aria-label={`${label}: ${met ? "met" : "not met"}`}
                        >
                          <span aria-hidden="true">{met ? "✅" : "❌"}</span>{" "}
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* ✅ Phase 1 Fix: inline confirm password match validation */}
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
                  required: "Please confirm your password",
                  validate: (value: string) =>
                    value === password || "Passwords do not match",
                }}
                error={errors.confirmPassword}
              />

              <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
            </form>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleOtpValidation();
              }}
            >
              <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-2">
                We sent a 6-digit OTP to{" "}
                <span className="font-semibold text-indigo-400">
                  {registerInfo?.email}
                </span>
              </p>

              <SSInput
                label="OTP"
                name="otp"
                placeholder="Enter 6-digit OTP"
                required={true}
                icon="fi fi-rr-key"
                register={register}
                validation={{
                  required: "Please enter OTP",
                  minLength: { value: 6, message: "OTP must be 6 digits" },
                  maxLength: { value: 6, message: "OTP must be 6 digits" },
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "OTP must contain only numbers",
                  },
                }}
                error={errors.otp}
              />

              <SSButton text="Verify OTP" type="submit" isLoading={isBusy} />

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || isBusy}
                  className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed"
                >
                  {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {!showOtpField && (
            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          )}
        </div>
      </motion.div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default SignUpComponent;