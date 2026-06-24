import { useState } from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
  FieldError,
} from "react-hook-form";
import toast from "react-hot-toast";
import { Copy, Dices, Eye, EyeOff } from "lucide-react";

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
  enablePasswordGenerator?: boolean;
  onGeneratePassword?: (newPassword: string) => void;
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
  enablePasswordGenerator,
  onGeneratePassword,
}: SSInputProps<T>) => {
  const [showLocalPassword, setShowLocalPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType
    ? showLocalPassword
      ? "text"
      : "password"
    : type;

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let newPassword = "";
    for (let i = 0; i < 16; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (onGeneratePassword) {
      onGeneratePassword(newPassword);
    }
  };

  const copyToClipboard = () => {
    const inputElement = document.getElementById(name) as HTMLInputElement;
    if (inputElement && inputElement.value) {
      navigator.clipboard.writeText(inputElement.value);
      toast.success("Password copied to clipboard!");
    } else {
      toast.error("No password to copy!");
    }
  };

  // Determine right padding based on available icons
  const rightPadding = isPasswordType 
    ? enablePasswordGenerator ? "pr-[6rem]" : "pr-11"
    : "pr-4";

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
          className={`w-full min-w-0 max-w-full h-11 block box-border rounded-xl border bg-white dark:bg-slate-900/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            icon ? "pl-11" : "px-4"
          } ${rightPadding} ${
            error
              ? "border-rose-500/80 focus:ring-rose-500/20 focus:border-rose-500 text-rose-200"
              : "border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
          }`}
        />

        {isPasswordType && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
            {enablePasswordGenerator && (
              <>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors cursor-pointer"
                  aria-label="Copy password"
                  title="Copy password"
                >
                  <Copy size={16} />
                </button>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors cursor-pointer"
                  aria-label="Generate strong password"
                  title="Generate strong password"
                >
                  <Dices size={16} />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowLocalPassword(!showLocalPassword)}
              className="flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors cursor-pointer"
              aria-label={showLocalPassword ? "Hide password" : "Show password"}
              title={showLocalPassword ? "Hide password" : "Show password"}
            >
              {showLocalPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
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