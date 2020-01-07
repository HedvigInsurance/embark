import * as React from "react";
import styled from "@emotion/styled";
import { fonts } from "@hedviginsurance/brand";
import { BankID } from "../../Icons/BankID";
import { DummyQRCode } from "../../Icons/DummyQRCode";
import { KeywordsContext } from "../../KeywordsContext";
import { DataFetchContext } from "./DataFetchContext";
import { ExternalInsuranceProviderStatus } from "../../API/externalInsuranceProviderData";

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
  const { operation } = React.useContext(DataFetchContext);

  React.useEffect(() => {
    if (!operation?.status) {
      return;
    }

    if (operation?.status != ExternalInsuranceProviderStatus.REQUIRES_AUTH) {
      onDone();
    }
  }, [operation]);

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
