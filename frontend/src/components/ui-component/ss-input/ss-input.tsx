import { useState } from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
  FieldError,
} from "react-hook-form";

function resolveAutoComplete(
  name: string,
  type: string,
  explicit?: string,
  passwordIntent: "current" | "new" = "current"
): string | undefined {
  if (explicit) return explicit;
  if (name === "email" || type === "email") return "email";
  if (name === "name") return "name";
  if (name === "otp") return "one-time-code";
  if (name === "confirmPassword") return "new-password";
  if (name === "password" || type === "password") {
    return passwordIntent === "new" ? "new-password" : "current-password";
  }
  return undefined;
}

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
  passwordIntent?: "current" | "new";
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
  passwordIntent = "current",
  autoFocus
}: SSInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const resolvedAutoComplete = resolveAutoComplete(
    String(name),
    type,
    autoComplete,
    passwordIntent
  );

  return (
    <div className="w-full min-w-0">
      <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      <div className="relative mt-2 w-full min-w-0">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <i className={icon}></i>
          </span>
        )}

        <input
          type={inputType}
          id={name}
          autoFocus={autoFocus}
          className={`block w-full min-w-0 box-border rounded-md border py-1.5 text-base sm:text-sm text-gray-900 dark:text-gray-200 bg-white dark:bg-slate-800 ${
            icon ? "pl-10" : "pl-3"
          } ${type === "password" ? "pr-10" : "pr-3"} ${
            error
              ? "border-red-500 outline-red-500"
              : "border-gray-300 dark:border-gray-600 outline-gray-300 focus:border-indigo-600 focus:outline-indigo-600"
          }`}
          placeholder={placeholder}
          autoComplete={resolvedAutoComplete}
          {...register(name, validation)}
        />

        {type === "password" && (


          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}

            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <i
              className={showPassword ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed"}
            ></i>

          </button>
        )}


      </div>
      {error && (

        <p className="text-red-400 text-sm mt-1">{error.message}</p>

      )}

    </div>
  );
};

export default SSInput;