import { ClipLoader, BeatLoader } from "react-spinners";

const sizeStyles = {
  xs: `min-w-[80px] min-h-[36px] px-2 py-1 text-xs`,
  sm: `min-w-[120px] min-h-[36px] px-3 py-1.5 text-sm`,
  rg: `min-w-[160px] min-h-[42px] px-4 py-2 text-md`,
};

const loaderSizes = {
  xs: 8,
  sm: 14,
  rg: 18,
};

export default function Button({
  loading = false,
  disabled = false,
  onClick,
  children,
  variant = "primary",
  size = "rg", // default regular
  type = "button",
  ...rest
}) {
  const baseStyle = `!text-md inline-flex items-center justify-center gap-2 rounded-[10px] transition-all font-medium cursor-pointer`;

  const styles = {
    primary: `bg-blue-700 hover:bg-blue-800 text-white`,
    secondary: `bg-white/10 hover:bg-white/20 text-white border border-white/10`,
    tertiary: `bg-orange-600 hover:bg-orange-700 text-white`,
  };

  const disabledStyles = {
    primary: `bg-gray-500 text-gray-200 !cursor-not-allowed border-none`,
    secondary: `bg-gray-700 text-gray-300 !cursor-not-allowed border border-gray-500`,
    tertiary: `bg-gray-600 text-gray-200 !cursor-not-allowed border-none`,
  };

  // Compose className combining base, size, and variant styles
  const sizeStyle = sizeStyles[size] || sizeStyles.rg;
  const variantStyle = disabled || loading ? disabledStyles[variant] || disabledStyles.primary : styles[variant] || styles.primary;

  const loaderSize = loaderSizes[size] || loaderSizes.rg;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variantStyle} ${sizeStyle}`}
      {...rest}
      style={{ fontSize: size === "xs" ? "12px" : size === "sm" ? "14px" : "15px", lineHeight: 2.1 }}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          {size === "xs" ? (
            <BeatLoader size={loaderSize} color="#ffffff" />
          ) : (
            <ClipLoader size={loaderSize} color="#ffffff" />
          )}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
