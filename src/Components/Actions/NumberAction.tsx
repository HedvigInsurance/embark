import * as React from "react"
import { StoreContext } from "../KeyValueStore";

type NumberActionProps = {
    placeholder: string,
    storeKey: string,
    link: any,
    onContinue: () => void
}

export const NumberAction = (props: NumberActionProps) => {
    const [textValue, setTextValue] = React.useState("")

    return <StoreContext.Consumer>
        {({ setValue }) => 
            <div>
                <input type="text" placeholder={props.placeholder} value={textValue} onChange={(e) => setTextValue(e.target.value)}  />
                <button onClick={() => {
                    setValue(props.storeKey, textValue)
                    props.onContinue()
                }}>{props.link.label}</button>
            </div>
        }
    </StoreContext.Consumer>
}