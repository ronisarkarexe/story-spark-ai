import { useForm, SubmitHandler } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useState, useEffect } from "react";
import { storeUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLoginMutation } from "../../redux/apis/auth.api";
import {
  useEmailVerifyMutation,
  useVerifyOtpMutation,
} from "../../redux/apis/otp.verify.api";
import { useRegisterUserMutation } from "../../redux/apis/auth.api";

import {
  WandSparkles,
  BookOpen,
  UsersRound,
} from "lucide-react";

interface IRegisterInfo {
  name: string;
  email: string;
  password: string;
}

interface Inputs extends IRegisterInfo {
  confirmPassword: string;
  otp: string;
}

/* ---------------- PASSWORD LOGIC ---------------- */

const getPasswordError = (password: string) => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "One uppercase letter required";
  if (!/[a-z]/.test(password)) return "One lowercase letter required";
  if (!/[0-9]/.test(password)) return "One number required";
  if (!/[^A-Za-z0-9]/.test(password)) return "One special character required";
  return "";
};

type StrengthLevel = "weak" | "medium" | "strong";

const PASSWORD_STRENGTH_CONFIG = {
  weak: { label: "Weak", barColor: "bg-red-500", barWidth: "w-1/3", textColor: "text-red-400" },
  medium: { label: "Medium", barColor: "bg-yellow-400", barWidth: "w-2/3", textColor: "text-yellow-300" },
  strong: { label: "Strong", barColor: "bg-green-500", barWidth: "w-full", textColor: "text-green-400" },
};

const getStrengthLevel = (n: number): StrengthLevel => {
  if (n <= 2) return "weak";
  if (n <= 4) return "medium";
  return "strong";
};

const PASSWORD_REQUIREMENTS = [
  { key: "length" as const, label: "Minimum 8 characters" },
  { key: "uppercase" as const, label: "One uppercase letter" },
  { key: "lowercase" as const, label: "One lowercase letter" },
  { key: "number" as const, label: "One number" },
  { key: "special" as const, label: "One special character" },
];

/* ---------------- COMPONENT ---------------- */

const SignUpComponent = () => {
  const navigate = useNavigate();

  const [emailVerify] = useEmailVerifyMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [registerUser] = useRegisterUserMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    unregister,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });

  const [isBusy, setIsBusy] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [registerInfo, setRegisterInfo] = useState<IRegisterInfo>();
  const [expiredAt, setExpiredAt] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";
  const otp = watch("otp");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;
  const strength = getStrengthLevel(passed);
  const { label, barColor, barWidth, textColor } =
    PASSWORD_STRENGTH_CONFIG[strength];

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
          unregister("confirmPassword");
          unregister("password");
          unregister("name");
          unregister("email");
          setShowOtpField(true);
          setCooldown(60);
        }
      } catch (error) {
  const err = error as { data?: Array<{ message?: string }>; message?: string };
  const message =
    err?.data?.[0]?.message ||
    err?.message ||
    "Something went wrong. Please try again.";
  toast.error(message);
  console.log("error: ", error);
} finally {
        setIsBusy(false);
      }
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const err = getPasswordError(data.password);
    if (err) {
      toast.error(err);
      return;
    }

    try {
      setIsBusy(true);

      const res = await emailVerify({
        name: data.name,
        email: data.email,
      }).unwrap();

      setRegisterInfo({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setExpiredAt(new Date(res.data.expiresAt).getTime());
      setShowOtpField(true);
      setCooldown(60);

      unregister("password");
      unregister("confirmPassword");
    } catch (e) {
      toast.error("Failed to send OTP");
    } finally {
      setIsBusy(false);
    }
  };

  /* ---------------- OTP VERIFY ---------------- */

  const handleOtpValidation = async () => {
    if (!otp || !registerInfo) return;

    try {
      setIsBusy(true);

      const verify = await verifyOtp({
        email: registerInfo.email,
        otp,
      }).unwrap();

      const res = await registerUser({
        ...registerInfo,
        verificationToken: verify.data.verificationToken,
      }).unwrap();

      storeUserInfo({ accessToken: res.data.accessToken });
      toast.success("Account created!");
      navigate("/");
    } catch {
      toast.error("OTP verification failed");
    } finally {
      setIsBusy(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center gap-10 px-6 bg-slate-50 dark:bg-slate-950">

      {/* LEFT PANEL */}
      <div className="w-full md:w-1/2 space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Turn Ideas Into Stories
        </h1>

        <p className="text-slate-600 dark:text-slate-300">
          AI-powered storytelling platform for creators.
        </p>

        <div className="space-y-3">
          <Feature icon={<WandSparkles />} title="Smart Writing" desc="AI understands ideas" />
          <Feature icon={<BookOpen />} title="Endless Creativity" desc="Generate stories easily" />
          <Feature icon={<UsersRound />} title="Built for Everyone" desc="Writers & creators" />
        </div>
      </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl w-full min-w-0 overflow-hidden">
          <h3 className="text-center text-2xl font-bold tracking-tight text-slate-200"></h3>
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
                <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          {" "}
          <h3 className="text-center text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {" "}
            {showOtpField ? "Verify Your Email" : "Create Account"}
          </h3>
          {!showOtpField && (
            <p className="mt-2 mb-5 text-center text-sm text-slate-400">
              {" "}
              Join StorySparkAI and begin your creative journey.
            </p>
          )}

          {!showOtpField && (
            <div className="relative my-6">
              {" "}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/60 text-slate-400 font-semibold">
                  SIGN UP WITH EMAIL
                </span>
              </div>
            </div>
          )}
          {!showOtpField ? (
            <form className="space-y-5 w-full min-w-0 overflow-hidden" onSubmit={handleSubmit(onSubmit)}>
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
                    message: "Only letters, numbers, spaces, underscores, and dots are allowed",
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
                error={errors.password}
              />

              {password?.length > 0 && (
                <div className="space-y-3 -mt-2 min-w-0 overflow-hidden">
                  <div
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden select-none"
                    role="progressbar"
                    aria-valuenow={passedChecks}
                    aria-valuemin={0}
                    aria-valuemax={PASSWORD_REQUIREMENTS.length}
                    aria-label="Password strength"
                  >
                    <div className={`h-full transition-all duration-300 ${barColor} ${barWidth}`} />
                  </div>

                  <p className={`text-xs font-bold uppercase tracking-wider select-none ${textColor}`} aria-live="polite">
                    {strengthLabel} Password
                  </p>

                  <ul className="space-y-1.5 list-none p-0 m-0 w-full box-border text-[11px] font-medium">
                    {PASSWORD_REQUIREMENTS.map(({ key, label }) => {
                      const met = passwordChecks[key];
                      return (
                        <li
                          key={key}
                          className={`flex items-center gap-2 ${met ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-600"}`}
                          aria-label={`${label}: ${met ? "met" : "not met"}`}
                        >
                          <i className={`fa-solid ${met ? "fa-circle-check" : "fa-circle-xmark"} text-xs shrink-0`} aria-hidden="true" />
                          <span>{label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <SSInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required={!showOtpField}
                icon="fi fi-rr-eye"
                register={register}
                autoComplete="new-password"
                validation={{
                  validate: (value) => {
                    if (showOtpField) return true;
                    if (!value) return "Confirm password is required";
                    if (value !== password) return "Passwords do not match!";
                    return true;
                  }
                }}
                error={errors.confirmPassword}
              />

              <div className="pt-2">
                <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-4 w-full box-border">
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

              <SSButton
                text="Verify OTP"
                type="button"
                onClick={handleOtpValidation}
                isLoading={isBusy}
              />

              <div className="text-center pt-2 select-none">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || isBusy}
                  className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 disabled:text-slate-400 dark:disabled:text-slate-600 transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed cursor-pointer"
                >
                  {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
                </button>
              </div>
            </div>
          )}
          {!showOtpField && (
            <>
              <div className="relative my-8 w-full box-border">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500 font-medium">
                    Or
                  </span>
                </div>
              </div>

        <h2 className="text-2xl font-bold text-center mb-4">
          {showOtpField ? "Verify OTP" : "Create Account"}
        </h2>

        {!showOtpField ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <SSInput label="Name" name="name" register={register} error={errors.name} />
            <SSInput label="Email" name="email" type="email" register={register} error={errors.email} />
            <SSInput label="Password" name="password" type="password" register={register} error={errors.password} />
            <SSInput label="Confirm Password" name="confirmPassword" type="password" register={register} error={errors.confirmPassword} />

            {/* Strength */}
            {password && (
              <div>
                <div className="h-2 bg-gray-200 rounded">
                  <div className={`${barColor} ${barWidth} h-full`} />
                </div>
                <p className={textColor}>{label} Password</p>
              </div>
            )}

            <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
          </form>
        ) : (
          <div className="space-y-4">
            <SSInput label="OTP" name="otp" register={register} error={errors.otp} />

            <SSButton text="Verify OTP" onClick={handleOtpValidation} isLoading={isBusy} />

            <button
              disabled={cooldown > 0}
              onClick={() => onSubmit as any}
              className="text-blue-500 text-sm"
            >
              {cooldown ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
            </button>
          </div>
        )}

      </div>

      <Toaster />
    </div>
  );
};

/* ---------------- SMALL COMPONENT ---------------- */

const Feature = ({ icon, title, desc }: any) => (
  <div className="flex gap-3 items-center p-3 border rounded-lg">
    <div className="text-purple-600">{icon}</div>
    <div>
      <p className="font-bold">{title}</p>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </div>
);

export default SignUpComponent;