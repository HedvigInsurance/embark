import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import hexToRgba from "hex-to-rgba";

const PillButton = styled.button`
  display: inline-block;
  appearance: none;
  transition: background-color 250ms;
  background-color: ${hexToRgba(colorsV2.lightgray, 0.8)};
  font-family: ${fonts.CIRCULAR};
  font-size: 13px;
  color: ${colorsV2.darkgray};
  cursor: pointer;
  border: 0;
  border-radius: 12px;
  outline: 0;
  padding: 5px 15px;

  :active {
    background-color: ${hexToRgba(colorsV2.lightgray, 0.5)};
  }
`;

interface SkipButtonProps {
  onClick: () => void;
  text: string;
}

export const SkipButton: React.FC<SkipButtonProps> = ({ onClick, text }) => (
  <PillButton onClick={onClick}>{text}</PillButton>
);
