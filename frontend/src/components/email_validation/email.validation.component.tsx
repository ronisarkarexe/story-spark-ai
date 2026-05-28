import React from "react";
import { useForm } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";

interface Inputs {
  otp: string;
}

const EmailValidationComponent = () => {
  const { register } = useForm<Inputs>();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center relative overflow-hidden px-4">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <h1 className="absolute top-6 right-6 font-medium text-slate-400 hover:text-slate-200 transition-colors duration-200 cursor-pointer z-20">
        Sign Out
      </h1>
      
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-200 mb-3 text-center">
          Verify your email
        </h2>
        <p className="text-sm text-center text-slate-400 mb-8 leading-relaxed">
          Enter the verification code sent to <br/>
          <span className="font-semibold text-blue-400">demo1234sefc@gmail.com</span>
        </p>
        
        <div className="space-y-4">
          <SSInput
            label="OTP"
            name="otp"
            placeholder="Enter your OTP"
            required={true}
            icon="fas fa-key"
            register={register}
          />
          <SSButton text="Verify OTP" type="button" />
        </div>
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
