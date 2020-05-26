import * as React from "react";
import styled from "@emotion/styled";
import { fonts } from "@hedviginsurance/brand";
import { Provider } from "./providers";
import { ContinueButton } from "../../ContinueButton";
import { KeywordsContext } from "../../KeywordsContext";
import { replacePlaceholders } from "../../Common";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 30px 20px;
  width: 350px;
`;

const Title = styled.h3`
  font-family: ${fonts.FAVORIT};
  margin-bottom: 10px;
  text-align: center;
`;

const Body = styled.p`
  font-family: ${fonts.FAVORIT};
  margin-bottom: 15px;
  text-align: center;
`;

interface SetupStepProps {
  provider: Provider;
  onContinue: () => void;
}

export const BackgroundFetchStep: React.FC<SetupStepProps> = ({
  provider,
  onContinue
}) => {
  const {
    externalInsuranceProviderContinueButton,
    externalInsuranceProviderBackgroundFetchTitle,
    externalInsuranceProviderBackgroundFetchBody
  } = React.useContext(KeywordsContext);

  return (
    <Container>
      <Title>{externalInsuranceProviderBackgroundFetchTitle}</Title>
      <Body>
        {replacePlaceholders(
          {
            provider: provider.name
          },
          externalInsuranceProviderBackgroundFetchBody
        )}
      </Body>
      <ContinueButton
        disabled={false}
        text={externalInsuranceProviderContinueButton}
        onClick={onContinue}
      />
    </Container>
  );
};
