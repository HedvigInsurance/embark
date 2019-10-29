import * as React from "react";
import { StoreContext } from "../KeyValueStore";
import styled from "@emotion/styled";
import { colors, fonts } from "@hedviginsurance/brand";
import { Tooltip } from "../Tooltip";

interface Focusable {
  isFocused: boolean;
}

const Card = styled.form<Focusable>`
  position: relative;
  min-width: 250px;
  min-height: 110px;
  border-radius: 8px;
  background-color: ${colors.WHITE};
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
    color: ${colors.BLACK};
    font-weight: 500;
`;

const Unit = styled.p`
  margin-top: 8px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: ${colors.DARK_GRAY};
  font-family: ${fonts.CIRCULAR};
`;

type NumberActionProps = {
  passageName: string;
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
  const [textValue, setTextValue] = React.useState("");
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <StoreContext.Consumer>
      {({ setValue }) => (
        <Card
          onSubmit={() => {
            setValue(props.storeKey, textValue);
            setValue(`${props.passageName}Result`, textValue);
            props.onContinue();
          }}
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
      )}
    </StoreContext.Consumer>
  );
};
