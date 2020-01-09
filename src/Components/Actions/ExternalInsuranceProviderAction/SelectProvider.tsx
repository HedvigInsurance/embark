import * as React from "react";
import { fonts, colorsV2 } from "@hedviginsurance/brand";
import styled from "@emotion/styled";
import { KeywordsContext } from "../../KeywordsContext";
import { ApiContext } from "../../API/ApiContext";

import { ProviderRow } from "./Components/ProviderRow";
import { providers, Provider } from "./providers";
import { Modal } from "../../Modal";
import { ContinueButton } from "../../ContinueButton";

const Container = styled.div`
  width: 400px;
  max-height: 250px;
  max-height: 40vh;
  overflow-y: scroll;
  padding: 20px;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  text-align: center;
`;

const Title = styled.h3`
  font-family: ${fonts.CIRCULAR};
  font-weight: 800;
  text-align: left;
`;

const OtherButton = styled.button`
  appearance: none;
  color: ${colorsV2.violet500};
  font-family: ${fonts.CIRCULAR};
  font-weight: 600;
  font-size: 14px;
  margin-top: 20px;
  border: 0;
  outline: 0;
  cursor: pointer;
`;

const OtherText = styled.p`
  font-family: ${fonts.CIRCULAR};
  font-size: 16px;
  margin-top: 25px;
  margin-bottom: 20px;
`;

interface SelectProviderProps {
  onPickProvider: (provider?: Provider) => void;
  onlyAcceptProvidersWithExternalCapabilities: boolean;
  otherProviderModalText: string;
  otherProviderModalButton: string;
}

export const SelectProvider: React.FC<SelectProviderProps> = ({
  onPickProvider,
  onlyAcceptProvidersWithExternalCapabilities,
  otherProviderModalText,
  otherProviderModalButton
}) => {
  const { externalInsuranceProviderProviderStatus } = React.useContext(
    ApiContext
  );
  const {
    externalInsuranceProviderSelectTitle,
    externalInsuranceProviderOtherProviderButton
  } = React.useContext(KeywordsContext);
  const [modalOpened, setModalOpened] = React.useState(false);
  const [modalResult, setModalResult] = React.useState<Provider | undefined>();
  const [functionalProviders, setFunctionalProviders] = React.useState<
    Provider[] | undefined
  >();

  React.useEffect(() => {
    externalInsuranceProviderProviderStatus().then(statuses => {
      setFunctionalProviders(
        statuses
          .filter(status => status.functional)
          .map(status =>
            providers.find(
              provider => provider.externalCollectionId === status.id
            )
          )
          .filter(item => item) as Provider[]
      );
    });
  }, []);

  const onClickRow = (provider: Provider) => {
    if (
      onlyAcceptProvidersWithExternalCapabilities &&
      !provider.hasExternalCapabilities
    ) {
      setModalOpened(true);
      setModalResult(provider);
    } else {
      if (!functionalProviders) {
        return;
      }

      if (!functionalProviders.includes(provider)) {
        setModalResult(undefined);
        setModalOpened(true);
        return;
      }

      onPickProvider(provider);
    }
  };

  return (
    <Container>
      <Title>{externalInsuranceProviderSelectTitle}</Title>
      {providers.map(provider => (
        <ProviderRow
          onClick={() => onClickRow(provider)}
          name={provider.name}
          icon={provider.icon && provider.icon({ forceWidth: true })}
        />
      ))}
      <OtherButton
        onClick={() => {
          setModalResult(undefined);
          setModalOpened(true);
        }}
      >
        {externalInsuranceProviderOtherProviderButton}
      </OtherButton>
      <Modal isVisible={modalOpened} onClose={() => setModalOpened(false)}>
        <OtherText>{otherProviderModalText}</OtherText>
        <ContinueButton
          disabled={false}
          onClick={() => onPickProvider(modalResult)}
          text={otherProviderModalButton}
        />
      </Modal>
    </Container>
  );
};
