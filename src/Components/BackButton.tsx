import * as React from "react";
import styled from "@emotion/styled";
import { fonts, colorsV2 } from "@hedviginsurance/brand";
import hexToRgba from "hex-to-rgba";
import { KeywordsContext } from "./KeywordsContext";

import { ArrowUp } from "./Icons/ArrowUp";

const Button = styled.button`
  -webkit-appearance: none;
  border: 0;
  border-radius: 28px;
  cursor: pointer;
  outline: 0;
  padding: 10px 20px;
  background-color: ${hexToRgba(colorsV2.white, 0.2)};
  font-family: ${fonts.CIRCULAR};
  color: ${colorsV2.white};
  font-size: 14px;
  transition: all 250ms;

  .ArrowUpStroke {
    transition: all 250ms;
  }

  :hover {
    transform: translateY(1.5px);
    background-color: ${colorsV2.white};
    color: ${colorsV2.darkgray};
    box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);

    .ArrowUpStroke {
      stroke: ${colorsV2.darkgray};
    }
  }

  :active {
    transform: translateY(3px);
  }
`;

const Spacer = styled.span`
  width: 5px;
  display: inline-block;
`;

type BackButtonProps = {
  onClick: () => void;
};

export const BackButton = (props: BackButtonProps) => {
  const { backButton } = React.useContext(KeywordsContext);

  return (
    <Button onClick={props.onClick}>
      <ArrowUp />
      <Spacer />
      {backButton}
    </Button>
  );
};
