import { useState } from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
  FieldError,
} from "react-hook-form";

interface SSInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T>;
  error?: FieldError;
  autoComplete?: string;
  autoFocus?: boolean;
}

const SSInput = <T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  register,
  validation,
  error,
  autoComplete,
  autoFocus,
}: SSInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);


  const isPasswordType = type === "password";
  const inputType = isPasswordType
    ? showLocalPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="w-full min-w-0 max-w-full box-border">
      <label
        htmlFor={name}
        className="block text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2 text-left select-none"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative w-full min-w-0 max-w-full box-border">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;
  const isPassword = type === "password";

  return (
    <div className="w-full min-w-0">
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400"
      >
        {label}
      </label>
      <div className="relative w-full min-w-0">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">

            <i className={icon}></i>
          </span>
        )}


        <input
          type={inputType}
          id={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          {...register(name, validation)}
          className={`w-full min-w-0 max-w-full h-11 block box-border rounded-xl border bg-white dark:bg-slate-900/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            icon ? "pl-11" : "px-4"
          } ${isPasswordType ? "pr-11" : "pr-4"} ${
            error
              ? "border-rose-500/80 focus:ring-rose-500/20 focus:border-rose-500 text-rose-200"
              : "border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
          }`}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowLocalPassword(!showLocalPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-slate-400 hover:text-slate-200 dark:text-slate-500 dark:hover:text-slate-300 z-10 focus:outline-none transition-colors cursor-pointer"
            aria-label={showLocalPassword ? "Hide password" : "Show password"}
            title={showLocalPassword ? "Hide password" : "Show password"}
          >
            <i
              className={
                showLocalPassword ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed"
              }
            ></i>
          </button>
        )}
      </div>

      {error && (
        <p
          className="text-xs font-semibold text-rose-400 mt-1.5 text-left w-full break-words"
          aria-live="polite"
        >

       <input
  type={inputType}
  id={name}
  className={`w-full min-w-0 max-w-full box-border pl-8 pr-10 py-1.5 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-slate-800 border-0 sm:text-sm ${
    error
      ? "outline-red-500"
      : "outline-gray-800 focus:outline-indigo-600"
  }`}
  placeholder={placeholder}
  autoComplete={autoComplete}
  {...register(name, validation)}
/>

        <input
          type={inputType}
          id={name}
          className={`box-border h-10 w-full rounded-lg border bg-white text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
            icon ? "pl-9" : "pl-3.5"
          } ${isPassword ? "pr-9" : "pr-3.5"} ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-500 dark:focus:border-indigo-400"
          }`}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          {...register(name, validation)}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            <i
              className={
                showPassword ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed"
              }
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 w-full break-words text-sm text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SSInput;
