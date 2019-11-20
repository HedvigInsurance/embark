import * as React from "react";
import { Flipped } from "react-flip-toolkit";
import { onExit, onElementAppear } from "./flip-utils";
import { AddItemButton } from "./AddItemButton";
import { CardContainer } from "./MultiActionCardComponents";

interface MultiActionAddButtonProps {
  label: string;
  onClick: () => void;
}

export const MultiActionAddButton = (props: MultiActionAddButtonProps) => (
  <Flipped
    translate
    onExit={onExit}
    onAppear={onElementAppear}
    flipId={"addButton"}
  >
    <CardContainer>
      <AddItemButton
        key="addButton"
        text={props.label}
        onClick={props.onClick}
      />
    </CardContainer>
  </Flipped>
);
