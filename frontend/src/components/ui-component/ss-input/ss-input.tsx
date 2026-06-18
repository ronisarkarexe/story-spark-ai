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
          <span className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-9 items-center justify-center text-slate-400">
            <i className={`${icon} text-sm`} aria-hidden="true" />
          </span>
        )}

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
