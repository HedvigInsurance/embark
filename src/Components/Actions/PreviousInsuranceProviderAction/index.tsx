import * as React from "react";
import styled from "@emotion/styled";
import { SelectProvider } from "../ExternalInsuranceProviderAction/SelectProvider";
import { StoreContext } from "../../KeyValueStore";
import { CardPrimitive } from "../Common";
import { Tooltip } from "../../Tooltip";
import { KeywordsContext } from "../../KeywordsContext";

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
  passageName: string;
  next: string;
  onContinue: (name: string) => void;
  tooltip?: any;
  skipLink: { name: string; label: string };
}

export const PreviousInsuranceProviderAction: React.FC<PreviousInsuranceProviderActionProps> = ({
  tooltip,
  next,
  onContinue,
  passageName,
  skipLink
}) => {
  const { setValue } = React.useContext(StoreContext);
  const {
    externalInsuranceProviderOtherProviderButton,
    previousInsuranceProviderOtherProviderModal
  } = React.useContext(KeywordsContext);

  return (
    <Container>
      <Card isFocused>
        <Content>
          <SelectProvider
            otherProviderModalText={previousInsuranceProviderOtherProviderModal}
            onSkip={() => {
              setValue("previousInsurer", "other");
              setValue(
                `${passageName}Result`,
                externalInsuranceProviderOtherProviderButton
              );
              onContinue(skipLink.name);
            }}
            skipLink={skipLink}
            onlyShowProvidersWithExternalCapabilities={false}
            onPickProvider={provider => {
              setValue("currentInsurer", provider.id);
              setValue(`${passageName}Result`, provider.name);
              onContinue(next);
            }}
          />
        </Content>
      </Card>
      {tooltip && <Tooltip tooltip={tooltip} />}
    </Container>
  );
};
