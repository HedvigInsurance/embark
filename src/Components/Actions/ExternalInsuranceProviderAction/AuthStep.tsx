import * as React from "react";
import styled from "@emotion/styled";
import { fonts } from "@hedviginsurance/brand";
import { BankID } from "../../Icons/BankID";
import { DummyQRCode } from "../../Icons/DummyQRCode";
import { KeywordsContext } from "../../KeywordsContext";

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
  onDone: () => void;
}

export const AuthStep: React.FC<AuthStepProps> = ({
  requiresQRAuth,
  onDone
}) => {
  const {
    externalInsuranceProviderAuthScanBankID,
    externalInsuranceProviderAuthOpenBankId
  } = React.useContext(KeywordsContext);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Container>
      {requiresQRAuth ? <DummyQRCode /> : <BankID />}
      <Title>
        {requiresQRAuth
          ? externalInsuranceProviderAuthScanBankID
          : externalInsuranceProviderAuthOpenBankId}
      </Title>
    </Container>
  );
};
