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
  required,
  icon,
  register,
  validation,
  error,
  autoComplete,
  autoFocus
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

  return (
    <div className="w-[80%] min-w-0">
      <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-400">
    <div className="w-full min-w-0 box-border">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">

        {label}
    <div className="w-full max-w-full flex flex-col box-border">
      <label 
        htmlFor={name} 
        className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 text-left"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      
      <div className="relative w-full max-w-full flex items-center box-border">
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
          className={`block w-full max-w-full box-border pl-10 ${
            type === "password" ? "pr-10" : "pr-3"
          } py-2 text-base text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-slate-800 border rounded-lg sm:text-sm ${
            error
              ? "border-red-500 outline-red-500"
              : "border-gray-300 dark:border-slate-700 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          }`}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register(name, validation)}
          autoFocus={autoFocus}
        />
        {type === "password" && (
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}

    className="absolute inset-y-0 right-2 flex items-center text-gray-500"

    
    aria-label={showPassword ? "Hide password" : "Show password"}
    title={showPassword ? "Hide password" : "Show password"}

  >
    <i className={showPassword ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed"}></i>
  </button>
)}
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-500 mt-1.5 text-left w-full break-words overflow-hidden">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SSInput;
