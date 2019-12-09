import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { ArrowRight } from "../../../Icons/ArrowRight";

const Row = styled.button`
  appearance: none;
  padding: 21px 23px;
  border: 1px solid ${colorsV2.lightgray};
  display: block;
  margin-top: 15px;
  width: 100%;
  outline: 0;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.span`
  font-family: ${fonts.CIRCULAR};
  font-size: 15px;
  font-weight: 600;
`;

interface ProviderRowProps {
  name: string;
  onClick: () => void;
}

export const ProviderRow: React.FC<ProviderRowProps> = ({ onClick, name }) => (
  <Row onClick={onClick}>
    <Name>{name}</Name>
    <ArrowRight />
  </Row>
);
