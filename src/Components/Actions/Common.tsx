import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";

interface Focusable {
  isFocused: boolean;
}

export const Card = styled.form<Focusable>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 250px;
  border-radius: 8px;
  background-color: ${colorsV2.white};
  transition: all 250ms;

  ${props =>
    props.isFocused &&
    `
        box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
        transform: translateY(-3px);
    `}
`;

export const Input = styled.input`
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 24px;
    font-size: 56px;
    line-height: 1;
    font-family: ${fonts.CIRCULAR}
    background: none;
    border: none;
    box-sizing: border-box;
    text-align: center;
    margin-top: 16px;
    color: ${colorsV2.black};
    font-weight: 500;
    outline: 0;

    ::placeholder {
      color: ${colorsV2.lightgray};
    }

`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Spacer = styled.span`
  height: 20px;
`;
