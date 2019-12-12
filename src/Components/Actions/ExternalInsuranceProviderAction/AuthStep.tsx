import * as React from "react";
import styled from "@emotion/styled";
import { fonts } from "@hedviginsurance/brand";
import { BankID } from "../../Icons/BankID";
import { DummyQRCode } from "../../Icons/DummyQRCode";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  width: 250px;
`;

const Title = styled.h4`
  font-family: ${fonts.CIRCULAR};
  font-weight: 800;
  text-align: center;
  margin-top: 15px;
`;

interface AuthStepProps {
  requiresQRAuth: boolean;
}

export const AuthStep: React.FC<AuthStepProps> = ({ requiresQRAuth }) => (
  <Container>
    {requiresQRAuth ? <DummyQRCode /> : <BankID />}
    <Title>
      {requiresQRAuth
        ? "Skanna QR-koden med BankID appen för att logga in"
        : "Öppna BankID på din mobiltelefon för att logga in."}
    </Title>
  </Container>
);
