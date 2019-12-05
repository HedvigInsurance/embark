import * as React from "react";
import { StoreContext } from "../KeyValueStore";
import styled from "@emotion/styled";
import { colors, fonts } from "@hedviginsurance/brand";
import { Tooltip } from "../Tooltip";
import { Card, Input, Container, Spacer } from "./Common";
import { ContinueButton } from "../ContinueButton";
import { wrapWithMask, MaskType, unmaskValue } from "./masking";
const smoothScroll = require("smoothscroll");

const Unit = styled.p`
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: center;
  color: ${colors.DARK_GRAY};
  font-family: ${fonts.CIRCULAR};

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

type NumberActionProps = {
  autoResultKey: string;
  placeholder: string;
  storeKey: string;
  unit: string;
  link: any;
  mask?: MaskType;
  maxValue?: number;
  minValue?: number;
  tooltip?: {
    title: string;
    description: string;
  };
  onContinue: () => void;
};

const isWithinBounds = (
  value: string,
  minValue: number | undefined,
  maxValue: number | undefined
): boolean => {
  const asNumber = Number(value);
  if (isNaN(asNumber)) {
    return false;
  }

  if (minValue && asNumber < minValue) {
    return false;
  }

  if (maxValue && asNumber > maxValue) {
    return false;
  }

  return true;
};

const InputWithMask = wrapWithMask(Input);

export const NumberAction = (props: NumberActionProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const { store, setValue } = React.useContext(StoreContext);
  const [textValue, setTextValue] = React.useState(store[props.storeKey] || "");

  const canContinue =
    textValue.length > 0 &&
    isWithinBounds(textValue, props.minValue, props.maxValue);
  const onContinue = () => {
    setValue(props.storeKey, textValue);
    setValue(`${props.autoResultKey}Result`, textValue);
    props.onContinue();
  };

  return (
    <Container>
      <Card
        onSubmit={e => {
          e.preventDefault();

          if (!canContinue) {
            return;
          }

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
          type="number"
          pattern={`[0-9]*`}
          placeholder={props.placeholder}
          value={textValue}
          onChange={e => setTextValue(unmaskValue(e.target.value, props.mask))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            smoothScroll(0);
          }}
        />
        <Unit>{props.unit}</Unit>
        <input type="submit" style={{ display: "none" }} />
      </Card>
      <Spacer />
      <ContinueButton
        onClick={onContinue}
        disabled={!canContinue}
        text={props.link.label}
      />
    </Container>
  );
};
