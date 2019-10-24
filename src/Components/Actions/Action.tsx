import * as React from "react"
import { SelectAction } from "./SelectAction/SelectAction"
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
        return <SelectAction action={props.action} changePassage={props.changePassage} />
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