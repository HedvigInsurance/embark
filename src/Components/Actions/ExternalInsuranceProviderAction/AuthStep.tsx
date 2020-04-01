import * as React from "react";
import styled from "@emotion/styled";
import { fonts } from "@hedviginsurance/brand";
import { BankID } from "../../Icons/BankID";
import { KeywordsContext } from "../../KeywordsContext";
import { DataFetchContext } from "./DataFetchContext";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  width: 250px;
`;

const Title = styled.h4`
  font-family: ${fonts.FAVORIT};
  font-weight: 800;
  text-align: center;
  margin-top: 15px;
`;

const QRImage = styled.img`
  width: 150px;
  height: 150px;
`;

export const AuthStep: React.FC = () => {
  const {
    externalInsuranceProviderAuthScanBankID,
    externalInsuranceProviderAuthOpenBankId
  } = React.useContext(KeywordsContext);
  const { operation } = React.useContext(DataFetchContext);

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
