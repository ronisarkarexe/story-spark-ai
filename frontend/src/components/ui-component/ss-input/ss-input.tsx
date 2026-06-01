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
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <i className={icon}></i>
          </span>
        )}

       <input
  type={inputType}
  id={name}
  className={`w-full box-border pl-8 pr-10 py-1.5 text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-slate-800 border-0 sm:text-sm ${
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
          className={`block w-80 max-w-full box-border pl-8 py-1.5 text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-slate-800 border rounded-md sm:text-sm ${
    error
      ? "border-red-500 outline-red-500"
      : "border-gray-300 outline-gray-300 focus:outline-indigo-600"
  }`} 
          placeholder={placeholder}
          autoComplete={autoComplete}
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