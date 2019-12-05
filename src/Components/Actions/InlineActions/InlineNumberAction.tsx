import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Input = styled.input<{ isSm?: boolean }>`
    margin-left: 16px;
    margin-right: 16px;
    font-size: 56px;
    line-height: 1;
    font-family: ${fonts.CIRCULAR}
    background: none;
    border: none;
    box-sizing: border-box;
    text-align: center;
    max-width: 100%;
    color: ${colorsV2.black};
    font-weight: 500;
    outline: 0;

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    appearance: none;
    -moz-appearance: textfield;

    ${props =>
      props.isSm
        ? `
        font-size: 16px;
        text-align: left;
        width: 100%;
        padding: 0 16px;
        line-height: 1.2;
        `
        : ""}

    ::placeholder {
        ${props =>
          props.isSm
            ? `
              color: ${colorsV2.gray};
            `
            : `
              color: ${colorsV2.lightgray};
            `}
    }
`;

const Unit = styled.p`
  margin: 8px auto 11px;
  text-align: center;
  color: ${colorsV2.gray};
  font-family: ${fonts.CIRCULAR};
`;

type InlineNumberActionProps = {
  placeholder: string;
  unit: string;
  value: string;
  onValue: (value: string) => void;
  isSm: boolean;
};

export const InlineNumberAction = (props: InlineNumberActionProps) => (
  <Container>
    <Input
      type="number"
      pattern={`[0-9]*`}
      placeholder={props.placeholder}
      value={props.value}
      onChange={e => {
        props.onValue(e.target.value);
      }}
      isSm={props.isSm}
    />
    {props.isSm || <Unit>{props.unit}</Unit>}
  </Container>
);
