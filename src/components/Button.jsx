import { ClipLoader } from 'react-spinners'

export default function Button({
  loading = false,
  disabled = false,
  onClick,
  children,
  variant = 'primary',
}) {
  const isPrimary = variant === 'primary'

  const baseStyle = `inline-flex items-center justify-center gap-3 cursor-pointer px-3 py-2 text-md rounded-xl transition-all font-medium min-w-[160px] min-h-[50px]`
  const primaryStyle = `bg-blue-700 hover:bg-blue-800 text-white`
  const secondaryStyle = `bg-white/10 hover:bg-white/20 text-white border border-white/10`

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${isPrimary ? primaryStyle : secondaryStyle}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
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
