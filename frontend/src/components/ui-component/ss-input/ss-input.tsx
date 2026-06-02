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
  autoFocus
}: SSInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);



  const inputType =

    type === "password" ? (showPassword ? "text" : "password") : type;



  return (
    <div className="w-full min-w-0">
      <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      <div className="relative mt-2 w-full min-w-0">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center text-gray-500 pointer-events-none">
            <i className={icon}></i>
          </span>
        )}

       <input
  type={inputType}
  id={name}
  className={`w-full box-border pl-6 sm:pl-8 pr-8 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-slate-800 transition-all duration-200 ${
    error
      ? "border-2 border-red-500"
      : "focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
  }`}
  placeholder={placeholder}
  autoComplete={autoComplete}
  autoFocus={autoFocus}
  {...register(name, validation)}
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
        <p className="text-red-400 text-sm mt-1 w-full break-words overflow-hidden">
        {error.message}
        </p>
    )}
    </div>
  );
};

export default SSInput;