import AuthLayout from "../auth/AuthLayout";
import { useForm, SubmitHandler } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useState, useEffect } from "react";
import { storeUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import { useVerifyOtpMutation } from "../../redux/apis/otp.verify.api";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../redux/apis/auth.api";
import { useNavigate, Link } from "react-router-dom";

interface Inputs {
  email: string;
  otp: string;
  password?: string;
  confirmPassword?: string;
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

const ForgotPasswordComponent = () => {
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resetPassword] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });

  const [step, setStep] = useState<number>(1);
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [verificationToken, setVerificationToken] = useState<string>("");
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [expiredAt, setExpiredAt] = useState<number>(0);

  const password = watch("password") || "";

  const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (!error || typeof error !== "object") return fallback;
    const data = (error as { data?: unknown }).data;
    if (!data) return fallback;

    if (Array.isArray(data)) {
      const maybeMessage = (data[0] as { message?: unknown } | undefined)?.message;
      return typeof maybeMessage === "string" ? maybeMessage : fallback;
    }

    const maybeMessage = (data as { message?: unknown }).message;
    return typeof maybeMessage === "string" ? maybeMessage : fallback;
  };

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;

  const passwordStrength =
    passedChecks <= 2
      ? "Weak"
      : passedChecks <= 4
      ? "Medium"
      : "Strong";

  const strengthColor =
    passwordStrength === "Weak"
      ? "bg-red-500"
      : passwordStrength === "Medium"
      ? "bg-yellow-400"
      : "bg-green-500";

  const strengthWidth =
    passwordStrength === "Weak"
      ? "w-1/3"
      : passwordStrength === "Medium"
      ? "w-2/3"
      : "w-full";

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRequestOtp: SubmitHandler<Inputs> = async (data) => {
    setIsBusy(true);
    try {
      const res = await forgotPassword({ email: data.email }).unwrap();
      if (res?.data) {
        const { expiresAt } = res.data;
        setExpiredAt(new Date(expiresAt).getTime());
        setEmailAddress(data.email);
        toast.success("OTP sent to your email successfully!");
        setOtpSent(true);
        setCooldown(60);
        setStep(2);
      }
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to request OTP. Please ensure email is registered.",
        ),
      );
      console.log("error: ", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleVerifyOtp: SubmitHandler<Inputs> = async (data) => {
    const enteredOtp = data.otp?.trim();
    if (!enteredOtp) {
      toast.error("Please enter OTP");
      return;
    }
    if (Date.now() > expiredAt) {
      toast.error("OTP expired. Please request a new one.");
      return;
    }
    setIsBusy(true);
    try {
      const res = await verifyOtp({
        email: emailAddress,
        otp: enteredOtp,
      }).unwrap();

      if (res?.data?.verificationToken) {
        toast.success("OTP verified successfully!");
        setVerificationToken(res.data.verificationToken);
        setStep(3);
      } else {
        throw new Error("Verification token missing in response");
      }
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          "OTP verification failed. Please check the code and try again.",
        ),
      );
      console.log("error: ", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleResetPassword: SubmitHandler<Inputs> = async (data) => {
    if (!data.password || !data.confirmPassword) {
      toast.error("Password fields are required");
      return;
    }
    if (data.password !== data.confirmPassword) {
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
      const res = await resetPassword({
        email: emailAddress,
        password: data.password,
        confirmPassword: data.confirmPassword,
        verificationToken,
      }).unwrap();

      if (res?.data?.accessToken) {
        toast.success("Password reset successfully! Logging you in...");
        storeUserInfo({ accessToken: res.data.accessToken });
        navigate("/");
      }
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Password reset failed. Please restart the process."),
      );
      console.log("error: ", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || isBusy) return;
    setIsBusy(true);
    try {
      const res = await forgotPassword({ email: emailAddress }).unwrap();
      if (res?.data) {
        const { expiresAt } = res.data;
        setExpiredAt(new Date(expiresAt).getTime());
        toast.success("OTP resent successfully!");
        setValue("otp", "");
        setCooldown(60);
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to resend OTP. Please try again."));
      console.log("resend error: ", error);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Reset Password"
        subtitle="Recover your account access in simple steps."
      >
        <div className="w-full space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-400 font-semibold bg-transparent">
                {step === 1 && "STEP 1: REQUEST OTP"}
                {step === 2 && "STEP 2: VERIFY OTP"}
                {step === 3 && "STEP 3: RESET PASSWORD"}
              </span>
            </div>
          </div>

          {step === 1 && (
            <form className="space-y-4" onSubmit={handleSubmit(handleRequestOtp)}>
              <SSInput
                label="Email address"
                name="email"
                type="email"
                placeholder="Enter your registered email"
                required={true}
                icon="fas fa-envelope"
                register={register}
                error={errors.email}
              />
              <SSButton text="Send OTP" type="submit" isLoading={isBusy} disabled={otpSent} />
            </form>
          )}

          {step === 2 && (
            <form className="space-y-4" onSubmit={handleSubmit(handleVerifyOtp)}>
              <SSInput
                label="OTP"
                name="otp"
                placeholder="Enter the 6-digit OTP"
                required={true}
                icon="fas fa-key"
                register={register}
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

          {step === 3 && (
            <form className="space-y-4" onSubmit={handleSubmit(handleResetPassword)}>
              <SSInput
                label="New Password"
                name="password"
                type="password"
                placeholder="Enter your new password"
                required={true}
                icon="fas fa-lock"
                register={register}
              />

              <div className="space-y-3 -mt-2">
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColor} ${strengthWidth}`}
                  ></div>
                </div>

                <p
                  className={`text-sm font-medium ${
                    passwordStrength === "Weak"
                      ? "text-red-400"
                      : passwordStrength === "Medium"
                      ? "text-yellow-300"
                      : "text-green-400"
                  }`}
                >
                  {passwordStrength} Password
                </p>

                <ul className="space-y-1 text-xs">
                  <li className={passwordChecks.length ? "text-green-400" : "text-red-400"}>
                    {passwordChecks.length ? "✅" : "❌"} Minimum 8 characters
                  </li>
                  <li className={passwordChecks.uppercase ? "text-green-400" : "text-red-400"}>
                    {passwordChecks.uppercase ? "✅" : "❌"} One uppercase letter
                  </li>
                  <li className={passwordChecks.lowercase ? "text-green-400" : "text-red-400"}>
                    {passwordChecks.lowercase ? "✅" : "❌"} One lowercase letter
                  </li>
                  <li className={passwordChecks.number ? "text-green-400" : "text-red-400"}>
                    {passwordChecks.number ? "✅" : "❌"} One number
                  </li>
                  <li className={passwordChecks.special ? "text-green-400" : "text-red-400"}>
                    {passwordChecks.special ? "✅" : "❌"} One special character
                  </li>
                </ul>
              </div>

              <SSInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                required={true}
                icon="fas fa-eye"
                register={register}
              />

              <SSButton text="Reset Password" type="submit" isLoading={isBusy} />
            </form>
          )}

          <div className="text-center text-sm text-indigo-600">
            <Link to="/login" className="block text-custom hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </AuthLayout>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default ForgotPasswordComponent;
