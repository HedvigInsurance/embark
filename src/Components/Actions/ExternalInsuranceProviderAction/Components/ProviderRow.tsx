import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";

const Row = styled.button`
  appearance: none;
  padding: 10px;
  border: 1px solid ${colorsV2.lightgray};
  display: block;
  margin-top: 15px;
  width: 100%;
  outline: 0;
  border-radius: 8px;
`;

const Name = styled.span``;

interface ProviderRowProps {
  name: string;
  onClick: () => void;
}

export const ProviderRow: React.FC<ProviderRowProps> = ({ onClick, name }) => (
  <Row onClick={onClick}>
    <Name>{name}</Name>
  </Row>
);
