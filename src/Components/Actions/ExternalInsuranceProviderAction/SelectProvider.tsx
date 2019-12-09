import * as React from "react";
import { fonts } from "@hedviginsurance/brand";
import styled from "@emotion/styled";
import { KeywordsContext } from "../../KeywordsContext";

import { ProviderRow } from "./Components/ProviderRow";
import { providers, Provider } from "./providers";

const Container = styled.div`
  width: 100%;
  max-height: 250px;
  overflow-y: scroll;
  padding: 20px;
  box-sizing: border-box;
`;

const Title = styled.h3`
  font-family: ${fonts.CIRCULAR};
  font-weight: 800;
`;

interface SelectProviderProps {
  onPickProvider: (provider: Provider) => void;
}

export const SelectProvider: React.FC<SelectProviderProps> = ({
  onPickProvider
}) => {
  const { externalInsuranceProviderSelectTitle } = React.useContext(
    KeywordsContext
  );

  return (
    <Container>
      <Title>{externalInsuranceProviderSelectTitle}</Title>
      {providers.map(provider => (
        <ProviderRow
          onClick={() => onPickProvider(provider)}
          name={provider.name}
        />
      ))}
    </Container>
  );
};
