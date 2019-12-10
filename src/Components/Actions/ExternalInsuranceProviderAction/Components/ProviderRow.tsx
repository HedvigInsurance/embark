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

const ProviderInfo = styled.div`
  display: flex;
  align-items: center;
`;

interface ProviderRowProps {
  name: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const ProviderRow: React.FC<ProviderRowProps> = ({
  icon,
  onClick,
  name
}) => (
  <Row onClick={onClick}>
    <ProviderInfo>
      {icon}
      <Name>{name}</Name>
    </ProviderInfo>
    <ArrowRight />
  </Row>
);
