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

  /* ---------------- SUBMIT ---------------- */

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

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 max-w-md bg-white dark:bg-slate-900 p-6 rounded-xl shadow">

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