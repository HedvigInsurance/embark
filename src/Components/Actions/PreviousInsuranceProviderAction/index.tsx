import * as React from "react";
import styled from "@emotion/styled";
import { SelectProvider } from "../ExternalInsuranceProviderAction/SelectProvider";
import { StoreContext } from "../../KeyValueStore";
import { CardPrimitive } from "../Common";
import { Tooltip } from "../../Tooltip";
import { KeywordsContext } from "../../KeywordsContext";
import {
  swedishProviders,
  Provider
} from "../ExternalInsuranceProviderAction/providers";

const Card = styled(CardPrimitive.withComponent("div"))`
  width: 400px;
  max-width: 100%;
  overflow: hidden;
`;

const Content = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

const Container = styled.div`
  position: relative;
`;

interface PreviousInsuranceProviderActionProps {
  providers: ReadonlyArray<Provider>;
  passageName: string;
  next: string;
  onContinue: (name: string) => void;
  tooltip?: any;
  skipLink: { name: string; label: string };
  storeKey?: string;
}

export const PreviousInsuranceProviderAction: React.FC<PreviousInsuranceProviderActionProps> = ({
  providers = swedishProviders,
  tooltip,
  next,
  onContinue,
  passageName,
  skipLink,
  storeKey = "currentInsurer"
}) => {
  const { setValue } = React.useContext(StoreContext);
  const { externalInsuranceProviderOtherProviderButton } = React.useContext(
    KeywordsContext
  );

  return (
    <Container>
      <Card isFocused>
        <Content>
          <SelectProvider
            providers={providers}
            onlyAcceptProvidersWithExternalCapabilities={false}
            onPickProvider={provider => {
              if (provider) {
                setValue(storeKey, provider.id);
                setValue(`${passageName}Result`, provider.name);
                onContinue(next);
              } else {
                setValue(storeKey, "other");
                setValue(
                  `${passageName}Result`,
                  externalInsuranceProviderOtherProviderButton
                );
                onContinue(skipLink.name);
              }
            }}
          />
        </Content>
      </Card>
      {tooltip && <Tooltip tooltip={tooltip} />}
    </Container>
  );
};
