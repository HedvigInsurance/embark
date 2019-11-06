import * as React from "react";
import { StoreContext } from "../KeyValueStore";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { Tooltip } from "../Tooltip";
import { ContinueButton } from "../ContinueButton";

interface Focusable {
  isFocused: boolean;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Spacer = styled.span`
  height: 20px;
`;

const Card = styled.form<Focusable>`
  position: relative;
  min-width: 250px;
  min-height: 110px;
  border-radius: 8px;
  background-color: ${colorsV2.white};
  transition: all 250ms;

  ${props =>
    props.isFocused &&
    `
        box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
        transform: translateY(-3px);
    `};
`;

const Input = styled.input`
    margin-left: 16px;
    margin-right: 16px;
    font-size: 56px;
    line-height: 1;
    font-family: ${fonts.CIRCULAR}
    background: none;
    border: none;
    box-sizing: border-box;
    text-align: center;
    max-width: 208px;
    margin-top: 16px;
    color: ${colorsV2.black};
    font-weight: 500;
    outline: 0;

    ::placeholder {
        color: ${colorsV2.lightgray};
    }
`;

const Unit = styled.p`
  margin-top: 8px;
  margin-bottom: 11px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: ${colorsV2.gray};
  font-family: ${fonts.CIRCULAR};
`;

type NumberActionProps = {
  autoResultKey: string;
  placeholder: string;
  storeKey: string;
  unit: string;
  link: any;
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

  return (
    <Container>
      <Card
        onSubmit={onContinue}
        isFocused={isFocused || isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip tooltip={props.tooltip} />
        <Input
          autoFocus
          type="text"
          placeholder={props.placeholder}
          value={textValue}
          onChange={e => setTextValue(e.target.value)}
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
