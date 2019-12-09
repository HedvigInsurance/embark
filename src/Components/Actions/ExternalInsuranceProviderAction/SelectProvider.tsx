import * as React from "react";
import { KeywordsContext } from "../../KeywordsContext";

import { ProviderRow } from "./Components/ProviderRow";
import { providers, Provider } from "./providers";

interface SelectProviderProps {
  onPickProvider: (provider: Provider) => void;
}

export const SelectProvider: React.FC<SelectProviderProps> = ({
  onPickProvider
}) => {
  const { externalInsuranceProviderSelectTitle } = React.useContext(
    KeywordsContext
  );

  return (
    <div>
      <h3>{externalInsuranceProviderSelectTitle}</h3>
      {providers.map(provider => (
        <ProviderRow
          onClick={() => onPickProvider(provider)}
          name={provider.name}
        />
      ))}
    </div>
  );
};
