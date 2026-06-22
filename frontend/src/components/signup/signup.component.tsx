import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";

import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { storeUserInfo } from "../../services/auth.service";
import { useGoogleLoginMutation, useRegisterUserMutation } from "../../redux/apis/auth.api";
import { useEmailVerifyMutation, useVerifyOtpMutation } from "../../redux/apis/otp.verify.api";

interface IRegisterInfo {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Inputs extends IRegisterInfo {
  otp: string;
}

const PASSWORD_REQUIREMENTS = [
  { key: "length" as const, label: "Minimum 8 characters" },
  { key: "uppercase" as const, label: "One uppercase letter" },
  { key: "lowercase" as const, label: "One lowercase letter" },
  { key: "number" as const, label: "One number" },
  { key: "special" as const, label: "One special character" },
];

export const SignUpComponent = () => {
  const navigate = useNavigate();
  const [emailVerify] = useEmailVerifyMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [registerUser] = useRegisterUserMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const { register, handleSubmit, watch, unregister, setValue, formState: { errors } } = useForm<Inputs>({ mode: "onChange" });

  const [isBusy, setIsBusy] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [registerInfo, setRegisterInfo] = useState<IRegisterInfo>();
  const [expiredAt, setExpiredAt] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const password = watch("password") || "";
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.password !== data.confirmPassword) return toast.error("Passwords do not match!");
    
    setIsBusy(true);
    try {
      const res = await emailVerify({ name: data.name, email: data.email }).unwrap();
      if (res?.data) {
        setExpiredAt(new Date(res.data.expiresAt).getTime());
        setRegisterInfo({ name: data.name, email: data.email, password: data.password, confirmPassword: data.confirmPassword });
        setShowOtpField(true);
        setCooldown(60);
      }
    } catch (err: any) {
      toast.error(err?.data?.[0]?.message || "Failed to initiate verification.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleOtpValidation = async () => {
    const otp = watch("otp")?.trim();
    if (!otp || !registerInfo) return toast.error("Invalid input or session expired.");
    
    setIsBusy(true);
    try {
      const otpRes = await verifyOtp({ email: registerInfo.email, otp }).unwrap();
      const userRes = await registerUser({ ...registerInfo, verificationToken: otpRes.data.verificationToken }).unwrap();
      storeUserInfo({ accessToken: userRes.data.accessToken });
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.[0]?.message || "OTP verification failed.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 relative">
      <div className="bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl w-full max-w-md">
        <button onClick={() => navigate("/")} className="text-blue-400 mb-4">← Back to Home</button>
        <h3 className="text-2xl font-bold text-center text-slate-200">{showOtpField ? "Verify Email" : "Create Account"}</h3>

        {showOtpField ? (
          <div className="mt-6 flex flex-col gap-4">
            <SSInput label="OTP" name="otp" register={register} placeholder="Enter 6-digit code" />
            <SSButton text="Verify OTP" onClick={handleOtpValidation} isLoading={isBusy} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
            <SSInput label="Name" name="name" register={register} error={errors.name} />
            <SSInput label="Email" name="email" register={register} error={errors.email} />
            <SSInput label="Password" name="password" type="password" register={register} error={errors.password} />
            <SSInput label="Confirm Password" name="confirmPassword" type="password" register={register} error={errors.confirmPassword} />
            <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
          </form>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default SignUpComponent;