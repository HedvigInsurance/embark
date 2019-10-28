import React, { useReducer } from "react"

type KeyValueStoreProps = {
    
}

export const StoreContext = React.createContext({ store: {}, setValue: (key: string, value: string) => {} });

const reducer = (state, action) => {
    switch (action.type) {
      case 'setValue':
        return { ...state, [action.key]: action.value };
      default:
        return state;
    }
  };

export const KeyValueStore = (props: React.Props<KeyValueStoreProps>) => {
    const [store, dispatch] = useReducer(reducer, { });

    return <StoreContext.Provider value={{ store, setValue: (key: string, value: string) => {
        dispatch({ type: "setValue", key, value })
     } }}>
        {props.children}
    </StoreContext.Provider>
}