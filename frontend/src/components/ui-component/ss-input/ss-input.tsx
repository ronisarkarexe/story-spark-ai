import { useState, useRef } from "react";
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
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPasswordType = type === "password";
  const inputType = isPasswordType
    ? showLocalPassword
      ? "text"
      : "password"
    : type;

  const togglePasswordVisibility = () => {
    setShowLocalPassword(!showLocalPassword);
  };

  const handlePasswordToggleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      togglePasswordVisibility();
    }
  };

  const handleMouseEnter = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowTooltip(false);
  };

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
          className={`w-full min-w-0 max-w-full h-11 block box-border rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            icon ? "pl-11" : "px-4"
          } ${isPasswordType ? "pr-11" : "pr-4"} ${
            error
              ? "border-rose-500/80 bg-white dark:bg-slate-900/40 text-rose-600 dark:text-rose-200 focus:ring-rose-500/20 focus:border-rose-500"
              : "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/40 text-slate-900 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
          }`}
        />

        {isPasswordType && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {/* Tooltip */}
            {showTooltip && (
              <div 
                className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"
                role="tooltip"
              >
                {showLocalPassword ? "Hide password (Space/Enter)" : "Show password (Space/Enter)"}
                <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
              </div>
            )}

            {/* Toggle Button */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              onKeyDown={handlePasswordToggleKeyDown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={handleMouseEnter}
              onBlur={handleMouseLeave}
              className="p-1.5 rounded-lg flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 z-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label={showLocalPassword ? `Hide ${label} password. Press Space or Enter to toggle.` : `Show ${label} password. Press Space or Enter to toggle.`}
              aria-pressed={showLocalPassword}
              title={showLocalPassword ? "Hide password (Space/Enter)" : "Show password (Space/Enter)"}
            >
              <i 
                className={`text-[16px] transition-colors ${
                  showLocalPassword 
                    ? "fi fi-rr-eye text-blue-500 dark:text-blue-400" 
                    : "fi fi-rr-eye-crossed text-slate-400 dark:text-slate-500"
                }`}
                aria-hidden="true"
              ></i>
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