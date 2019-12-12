import * as React from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { SelectProvider } from "./SelectProvider";
import { CardPrimitive } from "../Common";
import { Provider } from "./providers";
import { PersonalNumber } from "./PersonalNumber";
import { useMeasure } from "../../../Utils/useMeasure";
import { KeywordsContext } from "../../KeywordsContext";
import { StoreContext } from "../../KeyValueStore";

import { SetupStep } from "./SetupStep";
import { AuthStep } from "./AuthStep";
import { Animator } from "./Animator";

const Card = styled(CardPrimitive.withComponent("div"))`
  max-width: 100%;
  width: 400px;
  overflow: hidden;
`;

const HeightCalculation = styled.div`
  position: absolute;
  visiblity: hidden;
  opacity: 0;
`;

const HeightAnimation = styled(motion.div)`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const ContentItem = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
`;

enum Step {
  SELECT_PROVIDER,
  PERSONAL_NUMBER,
  SETUP,
  EXTERNAL_AUTH,
  BACKGROUND_FETCH
}

export enum AnimationDirection {
  FORWARDS,
  BACKWARDS
}

interface ExternalInsuranceProviderActionProps {
  next: string;
  onContinue: (name: string) => void;
  skipLink: { name: string; label: string };
  passageName: string;
}

export const ExternalInsuranceProviderAction: React.FC<ExternalInsuranceProviderActionProps> = ({
  onContinue,
  skipLink,
  passageName,
  next
}) => {
  const { setValue } = React.useContext(StoreContext);
  const [state, setState] = React.useState({
    currentStep: Step.SELECT_PROVIDER,
    animationDirection: AnimationDirection.FORWARDS,
    selectedProvider: null as Provider | null,
    personalNumber: null as string | null
  });
  const [bind, measured] = useMeasure<HTMLDivElement>();
  const {
    externalInsuranceProviderOtherProviderModal,
    externalInsuranceProviderOtherProviderButton
  } = React.useContext(KeywordsContext);

  const [selectProvider, personalNumber, setupStep, authStep] = [
    <SelectProvider
      key="SELECT_PROVIDER"
      otherProviderModalText={externalInsuranceProviderOtherProviderModal}
      onlyAcceptProvidersWithExternalCapabilities
      onPickProvider={provider => {
        if (provider && provider.hasExternalCapabilities) {
          setState({
            ...state,
            selectedProvider: provider,
            animationDirection: AnimationDirection.FORWARDS,
            currentStep: Step.PERSONAL_NUMBER
          });
        } else {
          if (provider) {
            setValue("currentInsurer", provider.id);
            setValue(`${passageName}Result`, provider.name);
          } else {
            setValue("currentInsurer", "other");
            setValue(
              `${passageName}Result`,
              externalInsuranceProviderOtherProviderButton
            );
          }

          onContinue(next);
        }
      }}
      skipLink={skipLink}
    />,
    <PersonalNumber
      key="PERSONAL_NUMBER"
      provider={state.selectedProvider!}
      onCancel={() => {
        setState({
          ...state,
          selectedProvider: null,
          animationDirection: AnimationDirection.BACKWARDS,
          currentStep: Step.SELECT_PROVIDER
        });
      }}
      onContinue={personalNumber => {
        setState({
          ...state,
          personalNumber: personalNumber,
          animationDirection: AnimationDirection.FORWARDS,
          currentStep: Step.SETUP
        });
      }}
    />,
    <SetupStep
      key="SETUP"
      provider={state.selectedProvider!}
      onSetup={() => {
        setState({
          ...state,
          animationDirection: AnimationDirection.FORWARDS,
          currentStep: Step.EXTERNAL_AUTH
        });
      }}
    />,
    <AuthStep key="EXTERNAL_AUTH" />
  ];

  const transitionConfig = {
    type: "spring",
    stiffness: 250,
    damping: 800
  };

  return (
    <Card isFocused={true}>
      <HeightCalculation {...bind}>
        {state.currentStep == Step.SELECT_PROVIDER && selectProvider}
        {state.currentStep == Step.PERSONAL_NUMBER && personalNumber}
        {state.currentStep == Step.SETUP && setupStep}
        {state.currentStep == Step.EXTERNAL_AUTH && authStep}
      </HeightCalculation>
      <HeightAnimation
        animate={{ height: measured.height }}
        transition={{ ...transitionConfig, clamp: true }}
      >
        <Content>
          <Animator animationDirection={state.animationDirection}>
            {state.currentStep == Step.SELECT_PROVIDER && selectProvider}
            {state.currentStep == Step.PERSONAL_NUMBER && personalNumber}
            {state.currentStep == Step.SETUP && setupStep}
            {state.currentStep == Step.EXTERNAL_AUTH && authStep}
          </Animator>
        </Content>
      </HeightAnimation>
    </Card>
  );
};
