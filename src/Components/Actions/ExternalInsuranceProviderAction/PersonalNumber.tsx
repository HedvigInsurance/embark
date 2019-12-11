import * as React from "react";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import styled from "@emotion/styled";
import { Input } from "../Common";
import { replacePlaceholders } from "../../Common";
import { wrapWithMask, isValid } from "../masking";
import { Provider } from "./providers";
import { KeywordsContext } from "../../KeywordsContext";
import { ContinueButton } from "../../ContinueButton";
import { ArrowLeft } from "../../Icons/ArrowLeft";

const Container = styled.div`
  padding: 20px;
`;

const PersonalNumberInput = wrapWithMask(Input);

const InputContainer = styled.div`
  border: 1px solid ${colorsV2.lightgray};
  border-radius: 8px;
  padding: 10px;

  input {
    width: 100%;
    margin: 0;
    padding: 0px 15px;
    box-sizing: border-box;
    font-size: 40px;

    &::placeholder {
      font-size: 40px;
    }
  }
`;

const BackButton = styled.button`
  appearance: none;
  cursor: pointer;
  border: 0;
  outline: 0;
  font-family: ${fonts.CIRCULAR};
  font-weight: 300;
  font-size: 13px;
  color: ${colorsV2.gray};
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  transition: color 250ms;

  :active {
    color: ${colorsV2.darkgray};

    svg {
      & > path {
        stroke: ${colorsV2.darkgray};
      }
    }
  }

  svg {
    transform: scale(0.8);

    & > path {
      transition: stroke 250ms;
    }
  }
`;

const BackButtonText = styled.span`
  margin-left: 6px;
  transform: translateY(-0.5px);
`;

const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

const Title = styled.h3`
  display: flex;
  align-items: center;
  font-family: ${fonts.CIRCULAR};
  font-weight: 800;
  margin-bottom: 15px;
`;

const Subtitle = styled.h4`
  display: flex;
  align-items: center;
  font-family: ${fonts.CIRCULAR};
  font-weight: 600;
  margin-bottom: 10px;
`;

interface PersonalNumberProps {
  provider: Provider;
  onCancel: () => void;
}

export const PersonalNumber: React.FC<PersonalNumberProps> = ({
  onCancel,
  provider
}) => {
  const [value, setValue] = React.useState("");
  const {
    externalInsuranceProviderPersonalNumberTitle,
    externalInsuranceProviderGoBackButton,
    externalInsuranceProviderPersonalNumberSubtitle
  } = React.useContext(KeywordsContext);

  return (
    <Container>
      <BackButton onClick={onCancel}>
        <ArrowLeft />
        <BackButtonText>{externalInsuranceProviderGoBackButton}</BackButtonText>
      </BackButton>
      <Title>
        {provider.icon && provider.icon({ forceWidth: false })}
        {replacePlaceholders(
          { provider: provider.name },
          externalInsuranceProviderPersonalNumberTitle
        )}
      </Title>
      <Subtitle>{externalInsuranceProviderPersonalNumberSubtitle}</Subtitle>
      <InputContainer>
        <PersonalNumberInput
          placeholder="ååmmdd-yyyy"
          mask="PersonalNumber"
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
        />
      </InputContainer>
      <ButtonContainer>
        <ContinueButton
          disabled={!isValid("PersonalNumber", value)}
          onClick={() => {}}
          text="Fortsätt"
        />
      </ButtonContainer>
    </Container>
  );
};
