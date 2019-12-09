import * as React from "react";
import styled from "@emotion/styled";
import { SelectProvider } from "../ExternalInsuranceProviderAction/SelectProvider";
import { StoreContext } from "../../KeyValueStore";
import { CardPrimitive } from "../Common";
import { Tooltip } from "../../Tooltip";

const Card = styled(CardPrimitive.withComponent("div"))`
  width: 400px;
  max-width: 100%;
`;

const Content = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

interface PreviousInsuranceProviderActionProps {
  passageName: string;
  next: string;
  onContinue: (name: string) => void;
  tooltip?: any;
}

export const PreviousInsuranceProviderAction: React.FC<PreviousInsuranceProviderActionProps> = ({
  tooltip,
  next,
  onContinue,
  passageName
}) => {
  const { setValue } = React.useContext(StoreContext);

  return (
    <Card isFocused>
      {tooltip && <Tooltip tooltip={tooltip} />}
      <Content>
        <SelectProvider
          onPickProvider={provider => {
            setValue("previousInsurer", provider.name);
            setValue(`${passageName}Result`, provider.name);
            onContinue(next);
          }}
        />
      </Content>
    </Card>
  );
};
