import * as React from "react";
import styled from "@emotion/styled";
import { SelectProvider } from "./SelectProvider";
import { CardPrimitive } from "../Common";
import { Provider } from "./providers";
import { PersonalNumber } from "./PersonalNumber";

const Card = CardPrimitive.withComponent("div");

const Content = styled.div`
  padding: 20px;
`;

enum Step {
  SELECT_PROVIDER,
  PERSONAL_NUMBER,
  SETUP,
  EXTERNAL_AUTH,
  BACKGROUND_FETCH
}

interface ExternalInsuranceProviderActionProps {
  next: string;
  onContinue: (name: string) => void;
}

export const ExternalInsuranceProviderAction: React.FC<ExternalInsuranceProviderActionProps> = () => {
  const [currentStep, setCurrentStep] = React.useState(Step.SELECT_PROVIDER);
  const [
    selectedProvider,
    setSelectedProvider
  ] = React.useState<Provider | null>(null);

  return (
    <Card isFocused={true}>
      <Content>
        {currentStep == Step.SELECT_PROVIDER && (
          <SelectProvider
            onPickProvider={provider => {
              setSelectedProvider(provider);
              setCurrentStep(Step.PERSONAL_NUMBER);
            }}
          />
        )}
        {currentStep == Step.PERSONAL_NUMBER && (
          <PersonalNumber provider={selectedProvider!} />
        )}
      </Content>
    </Card>
  );
};
