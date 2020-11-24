import * as React from 'react'
import { evaluateTemplateExpression } from './templateExpression'
import { useMemo } from 'react'

export type Store = Record<string, string>
export type ComputedValues = Record<string, string>

type KeyValueStoreProps = {
  initial?: Store
  computedValues?: ComputedValues
}

export const StoreContext = React.createContext<{
  store: Store
  setValue: (key: string, value: string) => void
  removeValues: (key: string) => void
}>({
  store: {},
  setValue: (key, value) => {},
  removeValues: (key) => {},
})

const reducer = (
  state: any,
  action: { type: string; key: string; value?: any },
) => {
  switch (action.type) {
    case 'setValue':
      return { ...state, [action.key]: action.value }
    case 'removeValues':
      return {
        ...Object.keys(state)
          .filter((key) => !key.includes(action.key))
          .reduce(
            (acc, curr) => ({
              ...acc,
              [curr]: state[curr],
            }),
            {},
          ),
      }
    default:
      return state
  }
}

export const createStoreWithComputedValues = (
  store: Store,
  computedProperties: ComputedValues,
) => {
  const fullStore = { ...store }
  Object.entries(computedProperties).forEach(([prop, expression]) => {
    Object.defineProperty(fullStore, prop, {
      get: () => evaluateTemplateExpression(expression, fullStore),
    })
  })
  return fullStore
}

export const KeyValueStore: React.FC<KeyValueStoreProps> = (props) => {
  const [store, dispatch] = React.useReducer(reducer, props.initial || {})
  const fullStore = useMemo(
    () => createStoreWithComputedValues(store, props.computedValues || {}),
    [store, props.computedValues],
  )

  return (
    <StoreContext.Provider
      value={{
        store: fullStore,
        setValue: (key, value) => {
          dispatch({ type: 'setValue', key, value })
        },
        removeValues: (key) => {
          dispatch({ type: 'removeValues', key })
        },
      }}
    >
      {props.children}
    </StoreContext.Provider>
  )
}
