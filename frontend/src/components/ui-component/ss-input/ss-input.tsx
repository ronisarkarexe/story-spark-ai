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
    <div>
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
          className="w-full pl-8 pr-10 py-1.5 text-base text-gray-200 bg-white/5 border border-white/10 rounded-xl
            placeholder:text-gray-500
            outline-none
            focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-0
            transition-all duration-200"
          placeholder={placeholder}
          {...register(name, { required })}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <i
              className={
                showPassword ? "fas fa-eye-slash" : "fas fa-eye"
              }
            ></i>
          </button>
        )}

      </div>
    </div>
  );
};

export default SSInput;
