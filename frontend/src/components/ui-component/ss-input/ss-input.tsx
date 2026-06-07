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
  autoFocus,
}: SSInputProps<T>) => {
  const [showLocalPassword, setShowLocalPassword] = useState(false);

  // FIXED: Standardized password visibility toggle logic locally
  const isPasswordType = type === "password";
  const inputType = isPasswordType ? (showLocalPassword ? "text" : "password") : type;

  return (
    <div className="w-full max-w-full flex flex-col box-border">
      <label 
        htmlFor={name} 
        className="block text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2 text-left select-none"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      
      <div className="relative w-full max-w-full flex items-center box-border rounded-xl">
        {icon && (
          <span className="absolute left-4 flex items-center justify-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
            <i className={icon}></i>
          </span>
        )}

        {/* FIXED: Replaced bg-transparent with explicit, deeply saturated theme-aware backdrops (bg-slate-900/40) 
            to override browser-injected user-agent autofill white backdrops */}
        <input
          type={inputType}
          id={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          {...register(name, validation)}
          className={`w-full h-11 block box-border rounded-xl border bg-slate-900/40 dark:bg-slate-900/60 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            icon ? "pl-11" : "px-4"
          } ${isPasswordType ? "pr-11" : "pr-4"} ${
            error
              ? "border-rose-500/80 focus:ring-rose-500/20 focus:border-rose-500 text-rose-200"
              : "border-slate-700 dark:border-slate-700/80 text-slate-100 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-slate-900/40"
          }`}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowLocalPassword(!showLocalPassword)}
            className="absolute right-4 flex items-center text-slate-400 hover:text-slate-200 dark:text-slate-500 dark:hover:text-slate-300 z-10 focus:outline-none transition-colors cursor-pointer"
            aria-label={showLocalPassword ? "Hide password" : "Show password"}
            title={showLocalPassword ? "Hide password" : "Show password"}
          >
            <i className={showLocalPassword ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed"}></i>
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs font-semibold text-rose-400 mt-1.5 text-left w-full break-words overflow-hidden" aria-live="polite">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SSInput;
