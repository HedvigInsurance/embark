import { useState, useEffect } from 'react'

/**
 * React hook to debounce a value for a given interval
 * @param value Value to debounce
 * @param delay Delay interval in milliseconds
 * @returns The same value
 */
const useDebounce = <T = any>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
