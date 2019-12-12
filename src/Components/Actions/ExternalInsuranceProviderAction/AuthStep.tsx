import * as React from "react";
import styled from "@emotion/styled";
import { BankID } from "../../Icons/BankID";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

export const AuthStep: React.FC = () => (
  <Container>
    <BankID />
  </Container>
);
