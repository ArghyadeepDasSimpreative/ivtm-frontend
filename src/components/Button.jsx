import { ClipLoader } from 'react-spinners'

export default function Button({
  loading = false,
  disabled = false,
  onClick,
  children,
  variant = 'primary',
  type = 'button',
  ...rest
}) {
  const baseStyle = `!text-md inline-flex items-center justify-center gap-2 
                     px-2 py-2 text-md rounded-[10px] transition-all font-medium 
                     min-w-[160px] min-h-[42px] cursor-pointer`;

  const styles = {
    primary: `bg-blue-700 hover:bg-blue-800 text-white`,
    secondary: `bg-white/10 hover:bg-white/20 text-white border border-white/10`,
    tertiary: `bg-orange-600 hover:bg-orange-700 text-white`,
  };

  const disabledStyles = {
    primary: `bg-gray-500 text-white cursor-not-allowed border-none`,
    secondary: `bg-gray-700 text-gray-300 cursor-not-allowed border border-gray-500`,
    tertiary: `bg-gray-600 text-white cursor-not-allowed border-none`
  };

  // Pick style based on enabled/disabled
  const variantStyle = disabled || loading
    ? disabledStyles[variant] || disabledStyles.primary
    : styles[variant] || styles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variantStyle}`}
      {...rest}
      style={{ fontSize: "15px", lineHeight: 2.1 }}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <ClipLoader size={18} color="#ffffff" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
