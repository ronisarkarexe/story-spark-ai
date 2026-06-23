import { useState } from "react";
import type {
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
  autoFocus,
}: SSInputProps<T>) => {
  const [showLocalPassword, setShowLocalPassword] = useState(false);

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
      <div className="relative mt-2 flex items-center">
        {icon && (
          //<span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">
            <span className="absolute left-3 text-gray-500 flex items-center pointer-events-none">
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
          className={`w-full min-w-0 max-w-full h-11 block box-border rounded-xl border-none bg-[#e0e5ec] dark:bg-[#1a1f2e] shadow-neumorphic-inset text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
            icon ? "pl-11" : "px-4"
          } ${isPasswordType ? "pr-11" : "pr-4"} ${
            error
              ? "ring-2 ring-rose-500/50 text-rose-500 dark:text-rose-400"
              : "text-slate-900 dark:text-slate-200"
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
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SSInput;