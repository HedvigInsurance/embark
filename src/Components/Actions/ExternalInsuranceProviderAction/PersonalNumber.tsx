import * as React from "react";
import { colorsV2 } from "@hedviginsurance/brand";
import styled from "@emotion/styled";
import { Input } from "../Common";
import { wrapWithMask } from "../masking";
import { Provider } from "./providers";
import { KeywordsContext } from "../../KeywordsContext";

const PersonalNumberInput = wrapWithMask(Input);

const InputContainer = styled.div`
  border: 1px solid ${colorsV2.lightgray};
  border-radius: 8px;
  padding: 10px;
`;

interface PersonalNumberProps {
  provider: Provider;
}

export const PersonalNumber: React.FC<PersonalNumberProps> = () => {
  const [value, setValue] = React.useState("");
  const { externalInsuranceProviderPersonalNumberTitle } = React.useContext(
    KeywordsContext
  );

  return (
    <div>
      <h3>{externalInsuranceProviderPersonalNumberTitle}</h3>
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
    </div>
  );
};
