import { useState, useEffect } from 'react'

/**
 * Returns a debounced version of the value that only updates
 * after the specified delay has elapsed since the last change.
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
