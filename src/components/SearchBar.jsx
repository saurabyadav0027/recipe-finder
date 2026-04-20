import { useRef, useEffect } from 'react'

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
  </svg>
)

const ClearIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
)

export default function SearchBar({ value, onChange, isLoading }) {
  const inputRef = useRef(null)

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search icon */}
      <span
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
          value ? 'text-amber-500' : 'text-ink-400'
        }`}
      >
        <SearchIcon />
      </span>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a dish, ingredient, or cuisine…"
        className="
          w-full pl-12 pr-12 py-4
          bg-white/80 backdrop-blur-sm
          border-2 border-cream-200
          rounded-2xl
          font-body text-ink-900 text-[15px] placeholder:text-ink-400
          shadow-[0_2px_20px_rgba(26,18,9,0.07)]
          focus:outline-none focus:border-amber-400 focus:bg-white
          transition-all duration-200
        "
        aria-label="Search recipes"
      />

      {/* Spinner or clear button */}
      <span className="absolute right-4 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <svg
            className="w-5 h-5 text-amber-500 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : value ? (
          <button
            onClick={() => onChange('')}
            className="text-ink-400 hover:text-ink-800 transition-colors"
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        ) : null}
      </span>
    </div>
  )
}
