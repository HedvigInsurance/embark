import * as React from "react";
import { Provider } from "./providers";
import { ApiContext } from "../../API/ApiContext";
import {
  ExternalInsuranceProviderEventEmitter,
  ExternalInsuranceProviderStatus,
  ExternalInsuranceProviderData
} from "../../API/externalInsuranceProviderData";
import EventEmitter from "eventemitter3";

export interface DataFetchOperation {
  id: string;
  status?: ExternalInsuranceProviderStatus;
  provider: Provider;
}

export const DataFetchContext = React.createContext<{
  operation: DataFetchOperation | null;
  startSession: (
    id: string,
    provider: Provider,
    personalNumber: string
  ) => void;
}>({
  operation: null,
  startSession: () => {}
});

export const DataFetchContextProvider: React.FC = ({ children }) => {
  const { externalInsuranceProviderStartSession } = React.useContext(
    ApiContext
  );
  const [operation, setOperation] = React.useState<DataFetchOperation | null>(
    null
  );
  const [session, setSession] = React.useState<EventEmitter<
    ExternalInsuranceProviderEventEmitter
  > | null>(null);

  React.useEffect(() => {
    if (session) {
      const listener = (data: ExternalInsuranceProviderData) => {
        if (operation) {
          setOperation({
            ...operation,
            status: data.status
          });
        }
      };

      session.on("data", listener);

      return () => {
        session.removeListener("data", listener);
      };
    }

    return () => {};
  }, [session]);

  return (
    <DataFetchContext.Provider
      value={{
        operation,
        startSession: (id, provider, personalNumber) => {
          setSession(externalInsuranceProviderStartSession(id, personalNumber));
          setOperation({
            id,
            provider
          });
        }
      }}
    >
      {children}
    </DataFetchContext.Provider>
  );
};
