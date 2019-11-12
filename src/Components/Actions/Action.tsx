import * as React from "react";
import { SelectAction } from "./SelectAction/SelectAction";
import { NumberAction } from "./NumberAction";
import { MultiAction } from "./MultiAction/MultiAction";
import { TextAction } from "./TextAction";
import { NumbersAction } from "./NumbersAction/NumbersAction";

type ActionProps = {
  passageName: string;
  action: any;
  changePassage: (name: string) => void;
};

export const Action = (props: ActionProps) => {
  if (!props.action) {
    return null;
  }

  if (props.action.component == "NumbersAction") {
    return (
      <NumbersAction
        passageName={props.passageName}
        action={props.action}
        changePassage={props.changePassage}
      />
    );
  }

  if (props.action.component == "MultiAction") {
    return (
      <MultiAction
        passageName={props.passageName}
        action={props.action}
        changePassage={props.changePassage}
      />
    );
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
        autoResultKey={props.passageName}
        mask={props.action.data.mask}
        tooltip={props.action.data.tooltip}
        storeKey={props.action.data.key}
        link={props.action.data.link}
        placeholder={props.action.data.placeholder}
        unit={props.action.data.unit}
        onContinue={() => props.changePassage(props.action.data.link.name)}
      />
    );
  }

  if (props.action.component == "TextAction") {
    return (
      <TextAction
        passageName={props.passageName}
        mask={props.action.data.mask}
        tooltip={props.action.data.tooltip}
        storeKey={props.action.data.key}
        link={props.action.data.link}
        placeholder={props.action.data.placeholder}
        onContinue={() => props.changePassage(props.action.data.link.name)}
      />
    );
  }

  return null;
};
