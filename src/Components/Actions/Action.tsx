import * as React from "react"
import { SelectOption } from "./SelectOption"
import { NumberAction } from "./NumberAction";

type ActionProps = {
    action: any,
    changePassage: (name: string) => void
}

export const Action = (props: ActionProps) => {
    if (!props.action) {
        return null
    }

    if (props.action.component == "SelectAction") {
        return props.action && props.action.data.options.map(option =>
            <SelectOption
                label={option.link.label}
                key={option.link.label}
                onClick={() => props.changePassage(option.link.name)} />
        )
    }

    if (props.action.component == "NumberAction") {
        return <NumberAction
            storeKey={props.action.data.key}
            link={props.action.data.link}
            placeholder={props.action.data.placeholder}
            onContinue={() => props.changePassage(props.action.data.link.name)} />
    }

    return null
}