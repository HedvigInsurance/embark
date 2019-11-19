import * as React from "react";
import styled from "@emotion/styled";
import { fonts, colorsV2 } from "@hedviginsurance/brand";
import { MaskType, wrapWithMask } from "../masking";

const Input = styled.input`
  margin-left: 16px;
  margin-right: 16px;
  font-size: 40px;
  font-family: ${fonts.CIRCULAR};
  background: none;
  border: none;
  margin-top: 16px;
  color: ${colorsV2.black};
  font-weight: 500;
  outline: 0;

  ::placeholder {
    color: ${colorsV2.lightgray};
  }
`;

interface Props {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  mask?: MaskType;
  large?: "true";
  autoFocus: boolean;
}

const Masked = wrapWithMask(Input);

const getInputSize = (placeholder: string, value: string, large?: "true") =>
  Math.max(
    large === "true" ? placeholder.length * 2 : placeholder.length,
    value.length
  );

export const InlineTextAction: React.FunctionComponent<Props> = props => {
  const size = getInputSize(props.placeholder, props.value, props.large);
  return (
    <Masked
      autoFocus={props.autoFocus}
      mask={props.mask}
      type="text"
      size={size}
      placeholder={props.placeholder}
      onChange={e => props.onChange(e.target.value)}
      value={props.value}
    />
  );
};
