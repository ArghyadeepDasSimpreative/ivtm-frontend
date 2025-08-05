import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const InputField = ({
  label,
  error,
  value,
  onChange,
  type = "text",
  leftItem = null,
  placeholder = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full !max-w-[600px]">
      {label && <label className="block text-md text-gray-600 mb-2">{label}</label>}
      <div className="relative w-full">
        {leftItem && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {leftItem}
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-md text-md focus:outline-none focus:ring-0 focus:border-gray-300
            ${leftItem ? "pl-10" : ""} ${type === "password" ? "pr-10" : ""}
          `}
          {...rest}
        />
        {type === "password" && (
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-md mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
