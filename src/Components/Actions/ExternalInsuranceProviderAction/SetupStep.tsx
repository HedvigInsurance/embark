import * as React from "react";
import styled from "@emotion/styled";
import { fonts } from "@hedviginsurance/brand";
import { Loading } from "../../API/Loading";
import { Provider } from "./providers";
import { KeywordsContext } from "../../KeywordsContext";
import { replacePlaceholders } from "../../Common";
import { DataFetchContext } from "./DataFetchContext";
import { ExternalInsuranceProviderStatus } from "../../API/externalInsuranceProviderData";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 30px 20px;
  width: 200px;
`;

const Title = styled.h3`
  font-family: ${fonts.CIRCULAR};
  font-weight: 800;
  margin-bottom: 15px;
  text-align: center;
`;

interface SetupStepProps {
  provider: Provider;
  onSetup: () => void;
}

export const SetupStep: React.FC<SetupStepProps> = ({ provider, onSetup }) => {
  const { operation } = React.useContext(DataFetchContext);
  const { externalInsuranceProviderSetupTitle } = React.useContext(
    KeywordsContext
  );

  React.useEffect(() => {
    if (!operation?.status) {
      return;
    }

    if (operation?.status !== ExternalInsuranceProviderStatus.CONNECTING) {
      onSetup();
    }
  }, [operation]);

  return (
    <Container>
      <Title>
        {replacePlaceholders(
          {
            provider: provider.name
          },
          externalInsuranceProviderSetupTitle
        )}
      </Title>
      <Loading addBorder />
    </Container>
  );
};
