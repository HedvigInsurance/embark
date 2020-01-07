import * as React from "react";
import { Provider } from "./providers";

export enum BackgroundFetchStatus {
  ONGOING,
  FAILED,
  COMPLETED
}

export interface BackgroundFetchOperation {
  id: string;
  status: BackgroundFetchStatus;
  provider: Provider;
}

export const BackgroundFetchContext = React.createContext<{
  operation: BackgroundFetchOperation | null;
  updateOperation: (operation: BackgroundFetchOperation | null) => void;
}>({
  operation: null,
  updateOperation: () => {}
});

export const BackgroundFetchContextProvider: React.FC = ({ children }) => {
  const [
    operation,
    setOperation
  ] = React.useState<BackgroundFetchOperation | null>(null);
  return (
    <BackgroundFetchContext.Provider
      value={{ operation, updateOperation: setOperation }}
    >
      {children}
    </BackgroundFetchContext.Provider>
  );
};
