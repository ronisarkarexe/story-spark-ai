import React, { useMemo, useState } from "react";
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
  const { register, handleSubmit, getValues } = useForm<Inputs>({
    mode: "onChange",
  });
  const [verifyOtp] = useVerifyOtpMutation();

  const email = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("email") || "";
  }, []);

  const [isBusy, setIsBusy] = useState(false);

  const onVerify = async () => {
    const otp = getValues("otp").trim();
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    if (!email) {
      toast.error("Missing email for verification. Please restart signup.");
      return;
    }

    setIsBusy(true);
    try {
      const res = await verifyOtp({ email, otp }).unwrap();

      const verificationToken = res?.data?.verificationToken;
      const accessToken = res?.data?.accessToken;

      // Backend may return either accessToken directly or a verificationToken.
      if (accessToken) {
        storeUserInfo({ accessToken });
        toast.success("Email verified successfully!");
        navigate("/dashboard", { replace: true });
        return;
      }

      if (!verificationToken) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      // If only verificationToken is returned, user still needs to complete registration.
      toast.success("OTP verified. Redirecting...");
      navigate(`/signup?email=${encodeURIComponent(email)}&verificationToken=${encodeURIComponent(verificationToken)}`, {
        replace: true,
      });
    } catch (e) {
      toast.error(
        (e as { data?: Array<{ message?: string }> })?.data?.[0]?.message ||
          "OTP verification failed. Please check the code and try again."
      );
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center relative overflow-hidden px-4">
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
      
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-200 mb-3 text-center">
          Verify your email
        </h2>
        <p className="text-sm text-center text-slate-400 mb-8 leading-relaxed">
          Enter the verification code sent to <br/>
          <span className="font-semibold text-blue-400">{email || "your email"}</span>
        </p>
        
        <form
          className="space-y-4"
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
          />
          <SSButton text="Verify OTP" type="submit" isLoading={isBusy} />
        </form>
        <p className="mt-8 text-sm text-center text-slate-400">
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
