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
  const baseStyle = `inline-flex items-center justify-center gap-2 cursor-pointer px-3 py-3 text-md rounded-[10px] transition-all font-medium min-w-[160px] min-h-[46px]`

  const styles = {
    primary: `bg-blue-700 hover:bg-blue-800 text-white`,
    secondary: `bg-white/10 hover:bg-white/20 text-white border border-white/10`,
    tertiary: `bg-orange-600 hover:bg-orange-700 text-white`,
  }

  const variantStyle = styles[variant] || styles.primary

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${variantStyle}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <ClipLoader size={18} color="#ffffff" />
        </div>
      ) : (
        children
      )}
    </button>
  )
}
