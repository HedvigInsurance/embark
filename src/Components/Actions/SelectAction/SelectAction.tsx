import * as React from "react"
import { SelectOption } from "./SelectOption"
import { StoreContext } from "../../KeyValueStore";

type SelectActionProps = {
    action: any,
    changePassage: (name: string) => void
}

export const SelectAction = (props: SelectActionProps) =>
    <StoreContext.Consumer>
        {({ setValue }) => 
            props.action.data.options.map(option =>
                <SelectOption
                    label={option.link.label}
                    key={option.link.label}
                    onClick={() => {
                        if (option.key) {
                            if (option.value) {
                                setValue(option.key, option.value)
                            } else {
                                setValue(option.key, option.link.label)
                            }
                        }
                        props.changePassage(option.link.name)
                    }} />
            )
        }
    </StoreContext.Consumer>