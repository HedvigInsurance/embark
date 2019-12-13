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
import uuid from "uuid/v1";
import { SkipButton } from "./Components/SkipButton";
import { BackgroundFetchStep } from "./BackgroundFetchStep";
import {
  BackgroundFetchContext,
  BackgroundFetchStatus
} from "./BackgroundFetchContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Card = styled(CardPrimitive.withComponent("div"))`
  max-width: 100%;
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

const Content = styled.div`
  width: 100%;
`;

const ButtonContainer = styled(motion.div)`
  margin-top: 20px;
  text-align: center;
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
  const { updateOperation } = React.useContext(BackgroundFetchContext);
  const { setValue } = React.useContext(StoreContext);
  const [state, setState] = React.useState({
    id: uuid(),
    currentStep: Step.SELECT_PROVIDER,
    animationDirection: AnimationDirection.FORWARDS,
    selectedProvider: null as Provider | null,
    personalNumber: null as string | null
  });
  const [bind, measured] = useMeasure<HTMLDivElement>();
  const {
    externalInsuranceProviderOtherProviderModal,
    externalInsuranceProviderOtherProviderButton,
    externalInsuranceProviderOtherProviderModalButton
  } = React.useContext(KeywordsContext);

  React.useEffect(() => {
    setValue("externalInsuranceProviderSessionId", state.id);
  }, []);

  const [
    selectProvider,
    personalNumber,
    setupStep,
    authStep,
    backgroundFetchStep
  ] = [
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
      otherProviderModalButton={
        externalInsuranceProviderOtherProviderModalButton
      }
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
        setValue("personalNumber", personalNumber);

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
    <AuthStep
      requiresQRAuth={true}
      key="EXTERNAL_AUTH"
      onDone={() => {
        updateOperation({
          id: state.id,
          status: BackgroundFetchStatus.ONGOING,
          provider: state.selectedProvider!
        });

        setTimeout(() => {
          updateOperation({
            id: state.id,
            status: BackgroundFetchStatus.COMPLETED,
            provider: state.selectedProvider!
          });
        }, 5000);

        setState({
          ...state,
          animationDirection: AnimationDirection.FORWARDS,
          currentStep: Step.BACKGROUND_FETCH
        });
      }}
    />,
    <BackgroundFetchStep
      provider={state.selectedProvider!}
      onContinue={() => {
        setValue("currentInsurer", state.selectedProvider!.id);
        setValue(`${passageName}Result`, state.selectedProvider!.name);
        onContinue(next);
      }}
    />
  ];

  const transitionConfig = {
    type: "spring",
    stiffness: 250,
    damping: 800
  };

  const getStepContent = () => {
    switch (state.currentStep) {
      case Step.SELECT_PROVIDER:
        return selectProvider;
      case Step.PERSONAL_NUMBER:
        return personalNumber;
      case Step.SETUP:
        return setupStep;
      case Step.EXTERNAL_AUTH:
        return authStep;
      case Step.BACKGROUND_FETCH:
        return backgroundFetchStep;
    }
  };

  const stepContent = getStepContent();

  return (
    <Container>
      <Card isFocused={true}>
        <HeightCalculation {...bind}>{stepContent}</HeightCalculation>
        <HeightAnimation
          animate={{ height: measured.height, width: measured.width }}
          transition={{ ...transitionConfig, clamp: true }}
        >
          <Content>
            <Animator animationDirection={state.animationDirection}>
              {stepContent}
            </Animator>
          </Content>
        </HeightAnimation>
      </Card>
      <ButtonContainer
        initial={{ height: "auto", opacity: 1 }}
        animate={
          state.currentStep == Step.BACKGROUND_FETCH
            ? { height: 0, opacity: 0 }
            : { height: "auto", opacity: 1 }
        }
      >
        <SkipButton
          onClick={() => {
            setValue(`${passageName}Result`, skipLink.label);
            onContinue(skipLink.name);
          }}
          text={skipLink.label}
        />
      </ButtonContainer>
    </Container>
  );
};
