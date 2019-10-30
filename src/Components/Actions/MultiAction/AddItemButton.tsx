import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import hexToRgba from "hex-to-rgba";

const AddItemButtonBase = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 150px;
  min-height: 150px;
  border: 0;
  -webkit-appearance: none;
  background-color: ${hexToRgba(colorsV2.white, 0.7)};
  outline: 0;
  flex-grow: 1;
  flex-basis: 0;
  border-radius: 8px;
  transition: transform 250ms, box-shadow 250ms, background-color 250ms;
  font-family: ${fonts.CIRCULAR};
  color: ${colorsV2.gray};
  font-size: 16px;
  cursor: pointer;

  svg {
    margin-bottom: 10px;
  }

  :hover {
    box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
    transform: translateY(-3px);
    background-color: ${colorsV2.white};
  }

  :active {
    transform: translateY(-1.5px);
  }
`;

type AddItemButtonProps = {
  text: string;
  onClick: () => void;
};

export const AddItemButton = (props: AddItemButtonProps) => (
  <AddItemButtonBase onClick={props.onClick}>
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="#9B9BAA"
        fill-rule="nonzero"
        d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 7.5a.818.818 0 0 0-.818.818v2.864H8.318a.818.818 0 0 0 0 1.636h2.864v2.864a.818.818 0 0 0 1.636 0v-2.864h2.864a.818.818 0 0 0 0-1.636h-2.864V8.318A.818.818 0 0 0 12 7.5z"
      />
    </svg>
    {props.text}
  </AddItemButtonBase>
);
