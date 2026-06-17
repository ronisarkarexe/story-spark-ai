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

interface IRegisterInfo {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Inputs extends IRegisterInfo {
  otp: string;
}

const getPasswordError = (password: string) => {
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character";
  return "";
};

type StrengthLevel = "weak" | "medium" | "strong";

const PASSWORD_STRENGTH_CONFIG: Record<
  StrengthLevel,
  { label: string; barColor: string; barWidth: string; textColor: string }
> = {
  weak: { label: "Weak", barColor: "bg-red-500", barWidth: "w-1/3", textColor: "text-red-400" },
  medium: { label: "Medium", barColor: "bg-yellow-400", barWidth: "w-2/3", textColor: "text-yellow-300" },
  strong: { label: "Strong", barColor: "bg-green-500", barWidth: "w-full", textColor: "text-green-400" },
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
  const [googleLogin] = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    watch,
    unregister,
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
  const { label: strengthLabel, barColor, barWidth, textColor } = PASSWORD_STRENGTH_CONFIG[strengthLevel];

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data) {
const user = {
  name: data.name,
  email: data.email,
  password: data.password,
  confirmPassword: data.confirmPassword,
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
        const message = err?.data?.[0]?.message || err?.message || "Something went wrong. Please try again.";
        toast.error(message);
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleOtpValidation = async () => {
    const enteredOtp = otp?.trim();
    if (!enteredOtp) { toast.error("Please enter OTP"); return; }
    if (!registerInfo) { toast.error("Something went wrong. Please restart the process."); return; }
    if (Date.now() > expiredAt) { toast.error("OTP expired. Please request a new one."); return; }

    setIsBusy(true);
    try {
      const otpResponse = await verifyOtp({ email: registerInfo.email, otp: enteredOtp }).unwrap();
      if (otpResponse?.data?.verificationToken) {
        const res = await registerUser({
          ...registerInfo,
          verificationToken: otpResponse.data.verificationToken,
        }).unwrap();
        if (res.data.accessToken) {
          toast.success("OTP validated successfully!");
          storeUserInfo({ accessToken: res.data.accessToken });
          navigate("/");
        }
      } else {
        throw new Error("No verification token received");
      }
    } catch (err: unknown) {
      const e = err as { data?: Array<{ message?: string }>; message?: string };
      const message = e?.data?.[0]?.message || e?.message || "OTP verification failed.";
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
    } catch (error: unknown) {
      const e = error as { data?: Array<{ message?: string }>; message?: string };
      const message =
        e?.data?.[0]?.message ||
        e?.message ||
        "Failed to resend OTP. Please try again.";
      toast.error(message);
      console.log("resend error: ", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed");
      return;
    }
    setIsBusy(true);
    try {
      const res = await googleLogin({ token: credentialResponse.credential }).unwrap();
      if (res?.data?.accessToken) {
        storeUserInfo({ accessToken: res.data.accessToken });
        toast.success("Logged in with Google successfully!");
        navigate("/");
      }
    } catch {
      toast.error("Google authentication failed");
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed. Please try again.");
  };

  const handleGoBack = () => {
    setShowOtpField(false);
  };

  useEffect(() => {
    if (!showOtpField && registerInfo) {
      setValue("name", registerInfo.name);
      setValue("email", registerInfo.email);
      setValue("password", registerInfo.password);
      setValue("confirmPassword", registerInfo.password);
    }
  }, [showOtpField, registerInfo, setValue]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:py-12 relative overflow-x-hidden text-slate-900 dark:text-slate-100 box-border">

      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex w-full max-w-md flex-col justify-center py-6 relative z-10 px-2 sm:px-0 min-w-0 box-border mx-auto">

        {/* Title */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
            STORY SPARK AI
          </h2>
        </div>


        {/* UPDATED: Structured layout classes to lock down maximum inner boundary constraints */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 sm:p-8 shadow-2xl w-full min-w-0 overflow-hidden box-border">

        <Link
  to="/"
  className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-blue-400"
>
  <span>←</span>
  <span>Back to Home</span>
</Link>
          <h3 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-slate-200">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 sm:p-8 shadow-2xl w-full min-w-0 overflow-hidden box-border">

          <h3 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">

            {showOtpField ? "Verify Your Email" : "Create Account"}
          </h3>
          {showOtpField && registerInfo && (
            <p className="mt-2 mb-4 text-center text-xs sm:text-sm text-slate-400 px-1">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-blue-400">{registerInfo.email}</span>.
              {" "}Not the right address?{" "}
              <button
                type="button"
                onClick={handleGoBack}
                className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors cursor-pointer"
              >
                Change email
              </button>
            </p>
          )}
          {!showOtpField && (
            <p className="mt-2 mb-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-1">
              Join StorySparkAI and begin your creative journey.
            </p>
          )}

          {!showOtpField && (
            <div className="relative mb-6 w-full box-border">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white dark:bg-slate-800 text-slate-400 font-semibold tracking-wide rounded-md">
                  SIGN UP WITH EMAIL
                </span>
              </div>
            </div>
          )}

          {!showOtpField ? (
            <form className="space-y-5 w-full min-w-0 block box-border" onSubmit={handleSubmit(onSubmit)}>

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
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
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
                <div className="space-y-3 -mt-1 w-full min-w-0 overflow-hidden box-border">
                  <div
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={passedChecks}
                    aria-valuemin={0}
                    aria-valuemax={5}
                  >
                    <div className={`h-full transition-all duration-300 ${barColor} ${barWidth}`} />
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
                    {strengthLabel} Password
                  </p>
                  <ul className="space-y-1.5 list-none p-0 m-0 w-full box-border text-[11px] font-medium">
                    {PASSWORD_REQUIREMENTS.map(({ key, label }) => {
                      const met = passwordChecks[key];
                      return (
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
                icon="fi fi-rr-lock"
                register={register}
                autoComplete="new-password"
                validation={{
                  validate: (value) => {
                    if (showOtpField) return true;
                    if (!value) return "Confirm password is required";
                    if (value !== password) return "Passwords do not match!";
                    return true;
                  },
                }}
                error={errors.confirmPassword}
              />

              <div className="pt-2 w-full box-border">
                <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-5 w-full min-w-0 box-border">
              <div className="w-full min-w-0 box-border">
                <SSInput
                  label="OTP"
                  name="otp"
                  placeholder="Enter your OTP"
                  required={true}
                  icon="fi fi-rr-key"
                  register={register}
                  validation={{
                    required: "Please enter OTP",
                    minLength: { value: 6, message: "OTP must be 6 digits" },
                    maxLength: { value: 6, message: "OTP must be 6 digits" },
                    pattern: { value: /^[0-9]{6}$/, message: "OTP must contain only numbers" },
                  }}
                  error={errors.otp}
                />
              </div>

              <div className="w-full box-border">
                <SSButton
                  text="Verify OTP"
                  type="button"
                  onClick={handleOtpValidation}
                  isLoading={isBusy}
                />
              </div>

              <div className="text-center pt-1 select-none flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || isBusy}
                  className="text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 disabled:text-slate-600 transition-colors duration-150 disabled:cursor-not-allowed cursor-pointer"
                >
                  {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
                </button>
                <button
                  type="button"
                  onClick={handleGoBack}
                  disabled={isBusy}
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-300 transition-colors duration-150 focus:outline-none cursor-pointer mt-1"
                >
                  Change Email
                </button>
              </div>
            </div>
          )}

          {!showOtpField && (
            <div className="w-full min-w-0 box-border">
              <div className="relative my-6 w-full box-border">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-4 text-slate-400 font-medium rounded-md">
                    Or
                  </span>
                </div>
              </div>

              <div className="flex justify-center w-full box-border overflow-hidden">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                />
              </div>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-blue-400 hover:underline transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default SignUpComponent;

