import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";

interface PerilItemProps {
  title: string;
}

const Button = styled.button`
  width: 116px;
  height: 92px;
  margin: 4px;
  border-radius: 4px;
  background-color: ${colorsV2.white};
  border: 1px solid ${colorsV2.lightgray};
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  :focus {
    outline: none;
  }
  :hover {
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.08);
  }
  :active {
    background-color: ${colorsV2.lightgray};
    box-shadow: none;
  }
`;

const Title = styled.div`
  font-size: 16px;
  letter-spacing: -0.23px;
  color: ${colorsV2.violet500};
  font-family: ${fonts.CIRCULAR};
`;

export const PerilItem = (props: PerilItemProps) => (
  <Button>
    <Title>{props.title}</Title>
  </Button>
);
