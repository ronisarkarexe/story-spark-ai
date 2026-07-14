import { useState } from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface SSInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  register: UseFormRegister<T>;
}

const SSInput = <T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  icon,
  register,
}: SSInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

const inputType =
  type === "password"
    ? showPassword
      ? "text"
      : "password"
    : type;
  return (
    <div className="w-full min-w-0">
      <label htmlFor={name} className="block text-sm font-medium text-gray-400">
        {label}
      </label>
      <div className="relative mt-2">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">
            <i className={icon}></i>
          </span>
        )}
        <input
          type={inputType}
          id={name}
          className="box-border w-full max-w-full pl-8 pr-10 py-1.5 text-base text-gray-200 border outline-1 -outline-offset-1 outline-gray-300 border-gray-300 rounded-md focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
          placeholder={placeholder}
          {...register(name, { required })}
        />
        {type === "password" && (
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
  >
    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
  </button>
)}
      </div>
    </div>
  );
};

export default SSInput;
