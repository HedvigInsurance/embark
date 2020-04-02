import * as React from "react";
import styled from "@emotion/styled";
import { fonts, colorsV3 } from "@hedviginsurance/brand";
import { MaskType, wrapWithMask } from "../masking";

const Input = styled.input<{ strongPlaceholder: boolean }>`
  margin-left: 16px;
  margin-right: 16px;
  font-size: 40px;
  font-family: ${fonts.FAVORIT};
  background: none;
  border: none;
  margin-top: 16px;
  color: ${colorsV3.gray900};
  outline: 0;
  width: 100%;

  ::placeholder {
    color: ${props =>
      props.strongPlaceholder ? colorsV3.gray500 : colorsV3.gray300};
  }

  @media (max-width: 600px) {
    font-size: 16px;
    margin-top: 0;
  }
`;

interface Props {
  placeholder: string;
  strongPlaceholder?: boolean;
  exampleValue?: string;
  value: string;
  onChange: (value: string) => void;
  mask?: MaskType;
  large?: "true";
  inputRef?: React.RefObject<HTMLInputElement>;
}

const Masked = wrapWithMask(Input);

const getInputSize = (exampleValue: string, value: string, large?: "true") =>
  Math.max(
    large === "true" ? exampleValue.length * 2 : exampleValue.length,
    value.length
  );

export const InlineTextAction: React.FunctionComponent<Props> = props => {
  const size = getInputSize(
    props.exampleValue || props.placeholder,
    props.value,
    props.large
  );

  return (
    <Masked
      mask={props.mask}
      inputRef={props.inputRef}
      type="text"
      size={size}
      placeholder={props.placeholder}
      strongPlaceholder={props.strongPlaceholder || false}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        props.onChange(e.target.value)
      }
      value={props.value}
    />
  );
};
