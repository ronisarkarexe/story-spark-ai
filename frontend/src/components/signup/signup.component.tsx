import { useForm, SubmitHandler } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useState } from "react";
import { storeUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import { useEmailVerifyMutation } from "../../redux/apis/otp.verify.api";
import { useRegisterUserMutation } from "../../redux/apis/auth.api";
import { useNavigate } from "react-router-dom";

interface IRegisterInfo {
  name: string;
  email: string;
  password: string;
}

interface Inputs extends IRegisterInfo {
  confirmPassword: string;
  otp: string;
}

const SignUpComponent = () => {
  const navigate = useNavigate();
  const [emailVerify] = useEmailVerifyMutation();
  const [registerUser] = useRegisterUserMutation();
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [showOtpField, setShowOtpField] = useState<boolean>(false);
  const [registerInfo, setRegisterInfo] = useState<IRegisterInfo>();
  const [expiredAt, setExpiredAt] = useState(0);
  const [serverOtp, setServerOtp] = useState<string | null>(null);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const otp = watch("otp");

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
      setIsBusy(true);
      try {
        const res = await emailVerify({ ...otpPayload }).unwrap();
        if (res) {
          const { otp, expiresAt } = res;
          setServerOtp(otp);
          setExpiredAt(expiresAt);
          toast.success("OTP sent to your email");
          setRegisterInfo(user);
          setShowOtpField(true);
        }
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleOtpValidation = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    if (Date.now() > expiredAt) {
      toast.error("OTP expired. Please request a new one.");
      return;
    }
    if (otp !== serverOtp) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }
    if (!registerInfo) {
      toast.error("Something went wrong. Please restart the process.");
      return;
    }
    setIsBusy(true);
    try {
      const res = await registerUser({ ...registerInfo }).unwrap();
      if (res.data.accessToken) {
        toast.success("OTP validated successfully!");
        storeUserInfo({ accessToken: res.data.accessToken });
        navigate("/");
      }
    } catch (err: unknown) {
      console.log("error: ", err);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="bg-slate-700 text-white min-h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-5xl text-indigo-300 font-bold">
            STORY SPARK AI
          </h2>
          <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-400">
            Sign up to your account
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          {!showOtpField ? (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <SSInput
                label="Name"
                name="name"
                placeholder="Enter your name"
                required={true}
                icon="fas fa-user"
                register={register}
              />
              <SSInput
                label="Email address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required={true}
                icon="fas fa-envelope"
                register={register}
              />
              <SSInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required={true}
                icon="fas fa-lock"
                register={register}
              />
              <SSInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required={true}
                icon="fas fa-eye"
                register={register}
              />
              <SSButton text="Sign Up" type="submit" isLoading={isBusy} />
            </form>
          ) : (
            <div className="space-y-4">
              <SSInput
                label="OTP"
                name="otp"
                placeholder="Enter your OTP"
                required={true}
                icon="fas fa-key"
                register={register}
              />
              <SSButton
                text="Verify OTP"
                type="button"
                onClick={handleOtpValidation}
                isLoading={isBusy}
              />
            </div>
          )}
          {!showOtpField && (
            <p className="mt-4 text-center text-sm/6 text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Sign in
              </a>
            </p>
          )}
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default SignUpComponent;
