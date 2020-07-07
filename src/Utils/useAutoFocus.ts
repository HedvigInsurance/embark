import * as React from 'react'
import ismobilejs from 'ismobilejs'

const useEffectOnceWhen = (effect: () => void, shouldRun: boolean) => {
  const [hasBeenTriggered, setHasBeenTriggered] = React.useState(false)

  return React.useEffect(() => {
    if (shouldRun && !hasBeenTriggered) {
      effect()
      setHasBeenTriggered(true)
    }
  }, [shouldRun])
}

export const useAutoFocus = (shouldAutoFocus: boolean) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  useEffectOnceWhen(() => {
    if (inputRef.current && !ismobilejs().any) {
      inputRef.current.focus()
    }
  }, shouldAutoFocus)

  return inputRef
}
