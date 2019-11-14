import * as React from "react";
import { StoreContext } from "../KeyValueStore";
import styled from "@emotion/styled";
import { colors, fonts } from "@hedviginsurance/brand";
import { Tooltip } from "../Tooltip";
import { Card, Input, Container, Spacer } from "./Common";
import { ContinueButton } from "../ContinueButton";
import { wrapWithMask, MaskType, unmaskValue } from "./masking";

const Unit = styled.p`
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: center;
  color: ${colors.DARK_GRAY};
  font-family: ${fonts.CIRCULAR};
`;

type NumberActionProps = {
  autoResultKey: string;
  placeholder: string;
  storeKey: string;
  unit: string;
  link: any;
  mask?: MaskType;
  tooltip?: {
    title: string;
    description: string;
  };
  onContinue: () => void;
};

export const NumberAction = (props: NumberActionProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const { store, setValue } = React.useContext(StoreContext);
  const [textValue, setTextValue] = React.useState(store[props.storeKey] || "");

  const onContinue = () => {
    setValue(props.storeKey, textValue);
    setValue(`${props.autoResultKey}Result`, textValue);
    props.onContinue();
  };

  const InputWithMask = wrapWithMask(Input, props.mask);

  return (
    <Container>
      <Card
        onSubmit={e => {
          e.preventDefault();
          onContinue();
        }}
        isFocused={isFocused || isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip tooltip={props.tooltip} />
        <InputWithMask
          size={Math.max(props.placeholder.length, textValue.length)}
          autoFocus
          type="text"
          placeholder={props.placeholder}
          value={textValue}
          onChange={e => setTextValue(unmaskValue(e.target.value, props.mask))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Unit>{props.unit}</Unit>
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
