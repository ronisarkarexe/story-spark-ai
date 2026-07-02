import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useVerifyOtpMutation } from "../../redux/apis/otp.verify.api";
import { storeUserInfo } from "../../services/auth.service";

interface Inputs {
  otp: string;
}

const EmailValidationComponent = () => {
  const navigate = useNavigate();
  const { register, getValues, formState: { errors } } = useForm<Inputs>({
    mode: "onChange",
  });
  const [verifyOtp] = useVerifyOtpMutation();

  const email = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("email") || "";
  }, []);

  const [isBusy, setIsBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success" | "info"; text: string } | null>(null);

  const onVerify = async () => {
    const otp = getValues("otp").trim();
    if (!otp) {
      toast.error("Please enter OTP");
      setStatusMessage({ type: "error", text: "Please enter a valid OTP code." });
      return;
    }
    if (!email) {
      toast.error("Missing email for verification. Please restart signup.");
      setStatusMessage({ type: "error", text: "Missing email context. Please restart the registration process." });
      return;
    }

    setIsBusy(true);
    setStatusMessage({ type: "info", text: "Verifying your security code, please wait..." });
    
    try {
      const res = await verifyOtp({ email, otp }).unwrap();

      const verificationToken = res?.data?.verificationToken;
      const accessToken = res?.data?.accessToken;

      if (accessToken) {
        storeUserInfo({ accessToken });
        toast.success("Email verified successfully!");
        setStatusMessage({ type: "success", text: "Verification successful! Redirecting to your dashboard..." });
        
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1500);
        return;
      }

      if (!verificationToken) {
        toast.error("Verification failed. Please try again.");
        setStatusMessage({ type: "error", text: "Verification failed. The platform did not return a valid session." });
        return;
      }

      toast.success("OTP verified. Redirecting...");
      setStatusMessage({ type: "success", text: "Code validated! Redirecting you to complete your signup..." });
      
      setTimeout(() => {
        navigate(`/signup?email=${encodeURIComponent(email)}&verificationToken=${encodeURIComponent(verificationToken)}`, {
          replace: true,
        });
      }, 1500);
    } catch (e) {
      const serverMessage = (e as { data?: Array<{ message?: string }> })?.data?.[0]?.message ||
        "OTP verification failed. Please check the code and try again.";
      
      toast.error(serverMessage);
      setStatusMessage({ type: "error", text: serverMessage });
    } finally {
      setIsBusy(false);
    }
  };

  const handleChangeEmail = () => {
    navigate("/signup", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center relative overflow-hidden px-4 box-border">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <button
        type="button"
        onClick={() => navigate("/", { replace: true })}
        className="absolute top-6 right-6 font-medium text-slate-400 hover:text-slate-200 transition-colors duration-200 cursor-pointer z-20"
        aria-label="Back to Home"
      >
        ← Back to Home
      </button>
      
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md min-w-0 box-border overflow-hidden relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-200 mb-3 text-center">
          Verify your email
        </h2>
        <p className="text-sm text-center text-slate-400 mb-2 leading-relaxed">
          Enter the verification code sent to <br/>
          <span className="font-semibold text-blue-400">{email || "your email"}</span>
        </p>

        {/* Change Email link */}
        <p className="text-xs text-center text-slate-500 mb-6">
          Wrong address?{" "}
          <button
            type="button"
            onClick={handleChangeEmail}
            disabled={isBusy}
            className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors cursor-pointer disabled:cursor-not-allowed"
            aria-label="Go back to sign up to change your email"
          >
            Change email
          </button>
        </p>
        
        <form
          className="space-y-4 w-full min-w-0 box-border"
          onSubmit={(e) => {
            e.preventDefault();
            onVerify();
          }}
        >
          <SSInput
            label="OTP"
            name="otp"
            placeholder="Enter your OTP"
            required={true}
            icon="fas fa-key"
            register={register}
            validation={{
              required: "Please enter OTP",
              minLength: { value: 6, message: "OTP must be 6 digits" },
              maxLength: { value: 6, message: "OTP must be 6 digits" },
              pattern: { value: /^[0-9]{6}$/, message: "OTP must contain only numbers" },
            }}
            error={errors.otp}
          />
          
          {/* Visual Feedback Banner Row */}
          {statusMessage && (
            <div 
              className={`p-3 text-xs rounded-lg border transition-all duration-200 ${
                statusMessage.type === "error" 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : statusMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === "info" && <span className="animate-spin text-sm">⏳</span>}
                <p>{statusMessage.text}</p>
              </div>
            </div>
          )}

          <SSButton 
            text={isBusy ? "Verifying..." : "Verify OTP"} 
            type="submit" 
            isLoading={isBusy} 
          />
        </form>
        
        <p className="mt-6 text-sm text-center text-slate-400 select-none">
          Entered the wrong email?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup", { replace: true })}
            className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 cursor-pointer"
          >
            Sign Up Again
          </button>
        </p>

        <p className="mt-6 text-sm text-center text-slate-400">
          Need help? Contact us at{" "}
          <a
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
            href="mailto:support@dreamgen.com"
          >
            support@dreamgen.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmailValidationComponent;