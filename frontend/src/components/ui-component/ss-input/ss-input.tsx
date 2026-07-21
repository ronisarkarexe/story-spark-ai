import { useState } from "react";
import type {
  FieldValues,
  Path,
  UseFormRegister,
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
  register: UseFormRegister<T>;   // <-- fixed, properly typed instead of `any`
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


      <div className="relative mt-2 flex items-center w-full min-w-0">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 flex items-center pointer-events-none">
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
          className={`w-full box-border max-w-full min-w-0 h-11 block rounded-xl border bg-transparent text-sm transition-all duration-200 ${
            icon ? "pl-10" : "px-4"
          } ${isPasswordType ? "pr-10" : "pr-4"} ${
            error
              ? "border-rose-500 focus:ring-2 focus:ring-inset focus:ring-rose-500/30 focus:border-rose-500 text-rose-900 dark:text-rose-400 placeholder-rose-300 focus:outline-none"
              : "border-slate-200 dark:border-slate-700 text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-inset focus:ring-blue-500/30 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          }`}
          style={{ boxSizing: "border-box", width: "100%", maxWidth: "100%" }}
        />

        {/* Right Password Eye Toggle */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowLocalPassword(!showLocalPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400 hover:text-slate-200 dark:text-slate-500 dark:hover:text-slate-300 z-10 focus:outline-none transition-colors cursor-pointer"
            aria-label={showLocalPassword ? "Hide password" : "Show password"}
            title={showLocalPassword ? "Hide password" : "Show password"}
          >
            <i className={showLocalPassword ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed"} />
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
