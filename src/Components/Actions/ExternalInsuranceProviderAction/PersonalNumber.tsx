import * as React from "react";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import styled from "@emotion/styled";
import { Input } from "../Common";
import { replacePlaceholders } from "../../Common";
import { wrapWithMask } from "../masking";
import { Provider } from "./providers";
import { KeywordsContext } from "../../KeywordsContext";
import { ContinueButton } from "../../ContinueButton";

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

const BackButton = styled.button``;

const Title = styled.h3`
  display: flex;
  align-items: center;
  font-family: ${fonts.CIRCULAR};
  font-weight: 800;
  margin-bottom: 15px;
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
  const { externalInsuranceProviderPersonalNumberTitle } = React.useContext(
    KeywordsContext
  );

  return (
    <Container>
      <BackButton onClick={onCancel}>Go back</BackButton>
      <Title>
        {provider.icon && provider.icon()}
        {replacePlaceholders(
          { provider: provider.name },
          externalInsuranceProviderPersonalNumberTitle
        )}
      </Title>
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
      <ContinueButton
        disabled={value.length === 0}
        onClick={() => {}}
        text="Fortsätt"
      />
    </Container>
  );
};
