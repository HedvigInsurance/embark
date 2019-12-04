import React from "react";

export type Store = { [key: string]: string };

type KeyValueStoreProps = {
  initial?: Store;
};

export const StoreContext = React.createContext<{
  store: Store;
  setValue: (key: string, value: string) => void;
  removeValues: (key: string) => void;
}>({
  store: {},
  setValue: (key, value) => {},
  removeValues: key => {}
});

const reducer = (
  state: any,
  action: { type: string; key: string; value?: any }
) => {
  switch (action.type) {
    case "setValue":
      return { ...state, [action.key]: action.value };
    case "removeValues":
      const matching = Object.keys(state).filter(key =>
        key.includes(action.key)
      );
      const res = { ...state };
      matching.forEach(m => {
        delete res[m];
      });
      return res;
    default:
      return state;
  }
};

export const KeyValueStore: React.FC<KeyValueStoreProps> = props => {
  const [store, dispatch] = React.useReducer(reducer, props.initial || {});

  return (
    <StoreContext.Provider
      value={{
        store,
        setValue: (key, value) => {
          dispatch({ type: "setValue", key, value });
        },
        removeValues: key => {
          dispatch({ type: "removeValues", key });
        }
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};
