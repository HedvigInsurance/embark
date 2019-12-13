import * as React from "react";
import { KeyValueStore, Store, StoreContext } from "./KeyValueStore";
import { KeywordsContext } from "./KeywordsContext";
import { TApiContext, ApiContext } from "./API/ApiContext";
import {
  TExternalRedirectContext,
  ExternalRedirectContext
} from "../externalRedirect";
import { BackgroundFetchContextProvider } from "./Actions/ExternalInsuranceProviderAction/BackgroundFetchContext";

interface EmbarkProviderProps {
  data: any;
  resolvers: TApiContext;
  externalRedirects: TExternalRedirectContext;
  onStoreChange?: (store: Store) => void;
  initialStore?: Store;
}

const StoreListener: React.FunctionComponent<EmbarkProviderProps> = props => {
  const { store } = React.useContext(StoreContext);

  React.useEffect(() => {
    props.onStoreChange && props.onStoreChange(store);
  }, [store]);

  return <>{props.children}</>;
};

export const EmbarkProvider: React.FunctionComponent<EmbarkProviderProps> = props => (
  <ExternalRedirectContext.Provider value={props.externalRedirects}>
    <BackgroundFetchContextProvider>
      <ApiContext.Provider value={props.resolvers}>
        <KeywordsContext.Provider value={props.data.keywords}>
          <KeyValueStore initial={props.initialStore}>
            <StoreListener {...props}>{props.children}</StoreListener>
          </KeyValueStore>
        </KeywordsContext.Provider>
      </ApiContext.Provider>
    </BackgroundFetchContextProvider>
  </ExternalRedirectContext.Provider>
);
