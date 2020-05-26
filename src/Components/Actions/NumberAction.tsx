import * as React from "react";
import { StoreContext } from "../KeyValueStore";
import styled from "@emotion/styled";
import { colors, fonts } from "@hedviginsurance/brand";
import { Tooltip } from "../Tooltip";
import { Card, Input, Container, Spacer, SubmitOnEnter } from "./Common";
import { ContinueButton } from "../ContinueButton";
import { wrapWithMask, MaskType, unmaskValue } from "./masking";
import animateScrollTo from "animated-scroll-to";
import { useAutoFocus } from "../../Utils/useAutoFocus";
import { colorsV3 } from "@hedviginsurance/brand/dist";

const Unit = styled.p`
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: center;
  color: ${colorsV3.gray900};
  font-family: ${fonts.FAVORIT};

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

type NumberActionProps = {
  isTransitioning: boolean;
  autoResultKey: string;
  placeholder: string;
  storeKey: string;
  unit: string;
  link: any;
  mask?: MaskType;
  maxValue?: string;
  minValue?: string;
  tooltip?: {
    title: string;
    description: string;
  };
  onContinue: () => void;
};

export const isWithinBounds = (
  value: string | null | undefined,
  minValue: string | undefined,
  maxValue: string | undefined
): boolean => {
  if (value === "") {
    return false;
  }

  const asNumber = Number(value);
  if (isNaN(asNumber) || value === null || value === undefined) {
    return false;
  }

  if (minValue && asNumber < Number(minValue)) {
    return false;
  }

  if (maxValue && asNumber > Number(maxValue)) {
    return false;
  }

  return true;
};

const NON_DIGITS = /[^\d]/;

const InputWithMask = wrapWithMask(Input);

export const NumberAction = (props: NumberActionProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const { store, setValue } = React.useContext(StoreContext);
  const [textValue, setTextValue] = React.useState(store[props.storeKey] || "");

  const canContinue =
    (typeof textValue === "string" || typeof textValue === "number") &&
    isWithinBounds(textValue, props.minValue, props.maxValue);
  const onContinue = () => {
    setValue(props.storeKey, textValue);
    setValue(`${props.autoResultKey}Result`, textValue);
    props.onContinue();
  };

  const inputRef = useAutoFocus(!props.isTransitioning);

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
          inputRef={inputRef}
          size={Math.max(props.placeholder.length, textValue.length)}
          type="number"
          pattern={`[0-9]*`}
          placeholder={props.placeholder}
          value={textValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (!NON_DIGITS.test(value)) {
              setTextValue(unmaskValue(value, props.mask));
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            animateScrollTo(0);
          }}
        />
        <Unit>{props.unit}</Unit>
        <SubmitOnEnter />
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
