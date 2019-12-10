import * as React from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { SelectProvider } from "./SelectProvider";
import { CardPrimitive } from "../Common";
import { Provider } from "./providers";
import { PersonalNumber } from "./PersonalNumber";
import { useMeasure } from "../../../Utils/useMeasure";
import { KeywordsContext } from "../../KeywordsContext";

const Card = styled(CardPrimitive.withComponent("div"))`
  width: 400px;
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

enum AnimationDirection {
  FORWARDS,
  BACKWARDS
}

interface ExternalInsuranceProviderActionProps {
  next: string;
  onContinue: (name: string) => void;
  skipLink: { name: string; label: string };
}

export const ExternalInsuranceProviderAction: React.FC<ExternalInsuranceProviderActionProps> = ({
  onContinue,
  skipLink
}) => {
  const [state, setState] = React.useState({
    currentStep: Step.SELECT_PROVIDER,
    animationDirection: AnimationDirection.FORWARDS,
    selectedProvider: null as Provider | null
  });
  const [bind, measured] = useMeasure<HTMLDivElement>();
  const { previousInsuranceProviderOtherProviderModal } = React.useContext(
    KeywordsContext
  );

  const content = [
    <SelectProvider
      otherProviderModalText={previousInsuranceProviderOtherProviderModal}
      onlyShowProvidersWithExternalCapabilities
      onPickProvider={provider => {
        setState({
          selectedProvider: provider,
          animationDirection: AnimationDirection.FORWARDS,
          currentStep: Step.PERSONAL_NUMBER
        });
      }}
      onSkip={() => {
        onContinue(skipLink.name);
      }}
      skipLink={skipLink}
    />,
    <PersonalNumber
      provider={state.selectedProvider!}
      onCancel={() => {
        setState({
          selectedProvider: null,
          animationDirection: AnimationDirection.FORWARDS,
          currentStep: Step.SELECT_PROVIDER
        });
      }}
    />
  ];

  const transitionConfig = {
    type: "spring",
    stiffness: 150,
    damping: 200
  };

  return (
    <Card isFocused={true}>
      <HeightCalculation ref={bind.ref}>
        {state.currentStep == Step.SELECT_PROVIDER && content[0]}
        {state.currentStep == Step.PERSONAL_NUMBER && content[1]}
      </HeightCalculation>
      <HeightAnimation
        animate={{ height: measured.height }}
        transition={transitionConfig}
      >
        <Content>
          <AnimatePresence>
            {state.currentStep == Step.SELECT_PROVIDER && (
              <ContentItem
                key="SELECT_PROVIDER"
                initial={{
                  opacity: 0,
                  x:
                    state.animationDirection == AnimationDirection.BACKWARDS
                      ? "100%"
                      : "-100%"
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-100%" }}
                transition={transitionConfig}
              >
                {content[0]}
              </ContentItem>
            )}
            {state.currentStep == Step.PERSONAL_NUMBER && (
              <ContentItem
                key="PERSONAL_NUMBER"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={transitionConfig}
              >
                {content[1]}
              </ContentItem>
            )}
          </AnimatePresence>
        </Content>
      </HeightAnimation>
    </Card>
  );
};
