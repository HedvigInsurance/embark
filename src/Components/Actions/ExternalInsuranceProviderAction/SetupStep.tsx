import * as React from "react";
import styled from "@emotion/styled";
import { fonts } from "@hedviginsurance/brand";
import { Loading } from "../../API/Loading";
import { Provider } from "./providers";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

const Title = styled.h3`
  font-family: ${fonts.CIRCULAR};
  font-weight: 800;
  margin-bottom: 15px;
`;

interface SetupStepProps {
  provider: Provider;
  onSetup: () => void;
}

export const SetupStep: React.FC<SetupStepProps> = ({ provider, onSetup }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSetup();
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Container>
      <Title>Kontaktar {provider.name}...</Title>
      <Loading />
    </Container>
  );
};
