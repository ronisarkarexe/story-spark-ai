import { useForm, SubmitHandler } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useState, useEffect } from "react";
import { storeUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useGoogleLoginMutation } from "../../redux/apis/auth.api";
import {
  useEmailVerifyMutation,
  useVerifyOtpMutation,
} from "../../redux/apis/otp.verify.api";
import { useRegisterUserMutation } from "../../redux/apis/auth.api";
import { useNavigate } from "react-router-dom";
import { WandSparkles, BookOpen, UsersRound } from "lucide-react";

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
      if (password !== data.confirmPassword) {
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
        const res = await emailVerify({ name: data.name, email: data.email }).unwrap();
        if (res?.data) {
          setExpiredAt(new Date(res.data.expiresAt).getTime());
          toast.success("OTP sent to your email");
          setRegisterInfo({ name: data.name, email: data.email, password: data.password });
          unregister("confirmPassword");
          unregister("password");
          unregister("name");
          unregister("email");
          setShowOtpField(true);
          setCooldown(60);
        }
      } catch (error) {
        const err = error as { data?: Array<{ message?: string }>; message?: string };
        toast.error(err?.data?.[0]?.message || err?.message || "Something went wrong.");
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
      toast.error("Something went wrong. Please restart.");
      return;
    }
    if (Date.now() > expiredAt) {
      toast.error("OTP expired. Please request a new one.");
      return;
    }
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
      }
    } catch (err: unknown) {
      const e = err as { data?: Array<{ message?: string }>; message?: string };
      toast.error(e?.data?.[0]?.message || e?.message || "Verification failed.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (!registerInfo) return;
    setIsBusy(true);
    try {
      const res = await emailVerify({ name: registerInfo.name, email: registerInfo.email }).unwrap();
      if (res?.data) {
        setExpiredAt(new Date(res.data.expiresAt).getTime());
        toast.success("A fresh OTP has been sent!");
        setCooldown(60);
      }
    } catch {
      toast.error("Failed to resend OTP.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      setIsBusy(true);
      try {
        const res = await googleLogin({ token: credentialResponse.credential }).unwrap();
        if (res?.data?.accessToken) {
          storeUserInfo({ accessToken: res.data.accessToken });
          toast.success("Logged in successfully with Google!");
          navigate("/");
        }
      } catch {
        toast.error("Google authentication failed.");
      } finally {
        setIsBusy(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex w-full max-w-6xl flex-col justify-center py-12 relative z-10 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
            STORY SPARK AI
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-24 w-full">
          <div className="flex flex-col gap-5 max-w-md">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-700 bg-clip-text text-transparent">
              Turns Ideas into
              <br /> 
              unforgettable stories
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              AI powered storytelling that helps you create, connect, inspire.
            </p>
  
            <div className="flex justify-center items-center gap-6 border border-gray-300 dark:border-slate-700/50 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
              <div><WandSparkles className="text-violet-600"/></div>
              <div>
                <h1 className="font-bold text-slate-800 dark:text-slate-200">Smart writing</h1>
                <p className="text-sm text-slate-500">AI that understands your ideas</p>
              </div>
            </div>
  
            <div className="flex justify-center items-center gap-6 border border-gray-300 dark:border-slate-700/50 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
              <div><BookOpen className="text-violet-600"/></div>
              <div>
                <h1 className="font-bold text-slate-800 dark:text-slate-200">Endless Creativity</h1>
                <p className="text-sm text-slate-500">Stories that captivate and inspire</p>
              </div>
            </div>
  
            <div className="flex justify-center items-center gap-6 border border-gray-300 dark:border-slate-700/50 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
              <div><UsersRound className="text-violet-600"/></div>
              <div>
                <h1 className="font-bold text-slate-800 dark:text-slate-200">Built for everyone</h1>
                <p className="text-sm text-slate-500">Writers, Creators and dreamers</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-center text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {showOtpField ? "Verify Your Email" : "Create Account"}
            </h3>

            {!showOtpField ? (
              <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
                <SSInput
                  label="Name"
                  name="name"
                  placeholder="Enter your name"
                  required={true}
                  icon="fi fi-rr-user"
                  register={register}
                  autoComplete="name"
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
                  <div className="space-y-3 -mt-2">
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${barColor} ${barWidth}`} />
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
                      {strengthLabel} Password
                    </p>
                    <ul className="space-y-1.5 list-none p-0 m-0 text-[11px] font-medium">
                      {PASSWORD_REQUIREMENTS.map(({ key, label }) => {
                        const met = passwordChecks[key];
                        return (
                          <li key={key} className={`flex items-center gap-2 ${met ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-600"}`}>
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
                  required={true}
                  icon="fi fi-rr-eye"
                  register={register}
                  autoComplete="new-password"
                  error={errors.confirmPassword}
                />

                <div className="pt-2">
                  <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-4 w-full">
                <SSInput
                  label="OTP"
                  name="otp"
                  placeholder="Enter your OTP"
                  required={true}
                  icon="fi fi-rr-key"
                  register={register}
                  error={errors.otp}
                />

                <SSButton text="Verify OTP" type="button" onClick={handleOtpValidation} isLoading={isBusy} />

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={cooldown > 0 || isBusy}
                    className="text-xs font-bold uppercase tracking-wider text-blue-600 disabled:text-slate-400"
                  >
                    {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            {!showOtpField && (
              <>
                <div className="relative my-8 w-full">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-slate-400">Or</span></div>
                </div>
                <div className="flex justify-center w-full">
                  <GoogleLogin 
                    onSuccess={handleGoogleLoginSuccess} 
                    onError={() => toast.error("Google login failed")} 
                  />
                </div>
                <p className="mt-8 text-center text-sm text-slate-500">
                  Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Sign In</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default SignUpComponent;