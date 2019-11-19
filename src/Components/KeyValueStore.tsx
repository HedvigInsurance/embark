import React from "react";

type KeyValueStoreProps = {};

export const StoreContext = React.createContext<{
  store: { [key: string]: any };
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
      return {
        ...Object.keys(state)
          .filter(key => key.includes(action.key))
          .reduce(
            (acc, curr) => ({
              ...acc,
              [curr]: state[curr]
            }),
            {}
          )
      };
    default:
      return state;
  }
};

export const KeyValueStore = (props: React.Props<KeyValueStoreProps>) => {
  const [store, dispatch] = React.useReducer(reducer, {});

  return (
    <StoreContext.Provider
      value={{
        store,
        setValue: (key: string, value: string) => {
          dispatch({ type: "setValue", key, value });
        },
        removeValues: (key: string) => {
          dispatch({ type: "removeValues", key });
        }
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};
