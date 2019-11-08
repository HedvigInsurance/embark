import * as React from "react";
import { StoreContext } from "../KeyValueStore";
import { Tooltip } from "../Tooltip";
import { Card, Input, Container, Spacer } from "./Common";
import styled from "@emotion/styled";
import { ContinueButton } from "../ContinueButton";
import { MaskType, wrapWithMask, unmaskValue } from "./masking";

const BottomSpacedInput = styled(Input)`
  margin-bottom: 24px;
`;

interface Props {
  passageName: string;
  storeKey: string;
  link: any;
  placeholder: string;
  mask?: MaskType;
  tooltip?: {
    title: string;
    description: string;
  };
  onContinue: () => void;
}

export const TextAction: React.FunctionComponent<Props> = props => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const { store, setValue } = React.useContext(StoreContext);
  const [textValue, setTextValue] = React.useState(store[props.storeKey] || "");

  const onContinue = () => {
    setValue(props.storeKey, textValue);
    setValue(`${props.passageName}Result`, textValue);
    props.onContinue();
  };

  const InputWithMask = wrapWithMask(BottomSpacedInput, props.mask);

  return (
    <Container>
      <Card
        isFocused={isFocused || isHovered}
        onSubmit={e => {
          e.preventDefault();
          onContinue();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip tooltip={props.tooltip} />
        <InputWithMask
          autoFocus
          size={Math.max(props.placeholder.length, textValue.length)}
          placeholder={props.placeholder}
          type="text"
          value={textValue}
          onChange={e => setTextValue(unmaskValue(e.target.value, props.mask))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <input type="submit" style={{ display: "none" }} />
      </Card>
      <Spacer />
      <ContinueButton
        onClick={onContinue}
        disabled={textValue.length == 0}
        text={props.link.label}
      />
    </Container>
  );
};
