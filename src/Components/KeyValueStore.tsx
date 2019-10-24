import * as React from "react"

type KeyValueStoreProps = {
    
}

export const StoreContext = React.createContext({ store: {}, setValue: (key: string, value: string) => {} });

export const KeyValueStore = (props: React.Props<KeyValueStoreProps>) => {
    const [store, setStore] = React.useState({})

    return <StoreContext.Provider value={{ store, setValue: (key: string, value: string) => {
        console.log(key, value)
        setStore({ ...store, [key]: value })

     } }}>
        {props.children}
    </StoreContext.Provider>
}