import * as React from "react";
import { SelectAction } from "./SelectAction/SelectAction";
import { NumberAction } from "./NumberAction";

type ActionProps = {
  passageName: string;
  action: any;
  changePassage: (name: string) => void;
};

export const Action = (props: ActionProps) => {
  if (!props.action) {
    return null;
  }

  if (props.action.component == "SelectAction") {
    return (
      <SelectAction
        passageName={props.passageName}
        action={props.action}
        changePassage={props.changePassage}
      />
    );
  }

  if (props.action.component == "NumberAction") {
    return (
      <NumberAction
        passageName={props.passageName}
        tooltip={props.action.data.tooltip}
        storeKey={props.action.data.key}
        link={props.action.data.link}
        placeholder={props.action.data.placeholder}
        unit={props.action.data.unit}
        onContinue={() => props.changePassage(props.action.data.link.name)}
      />
    );
  }

  return null;
};
