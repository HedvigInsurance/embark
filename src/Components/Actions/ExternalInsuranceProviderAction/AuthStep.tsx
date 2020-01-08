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

const QRImage = styled.img`
  width: 150px;
  height: 150px;
`;

interface AuthStepProps {
  onDone: () => void;
}

export const AuthStep: React.FC<AuthStepProps> = ({ onDone }) => {
  const {
    externalInsuranceProviderAuthScanBankID,
    externalInsuranceProviderAuthOpenBankId
  } = React.useContext(KeywordsContext);
  const { operation } = React.useContext(DataFetchContext);

  React.useEffect(() => {
    if (!operation?.data?.status) {
      return;
    }

    if (
      operation?.data?.status != ExternalInsuranceProviderStatus.REQUIRES_AUTH
    ) {
      onDone();
    }
  }, [operation]);

  return (
    <Container>
      {operation?.data?.imageValue ? (
        <QRImage src={operation?.data?.imageValue} />
      ) : (
        <BankID />
      )}
      <Title>
        {operation?.data?.imageValue
          ? externalInsuranceProviderAuthScanBankID
          : externalInsuranceProviderAuthOpenBankId}
      </Title>
    </Container>
  );
};
