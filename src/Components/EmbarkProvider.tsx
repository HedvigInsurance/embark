import * as React from "react";
import { KeyValueStore, Store, StoreContext } from "./KeyValueStore";
import { KeywordsContext } from "./KeywordsContext";
import { TApiContext, ApiContext } from "./API/ApiContext";
import { PartnerContext } from "./PartnerContext";
import { Partner } from "./Icons/Partners";
import {
  TExternalRedirectContext,
  ExternalRedirectContext
} from "../externalRedirect";

interface EmbarkProviderProps {
  data: any;
  resolvers: TApiContext;
  partner?: Partner;
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

export const EmbarkProvider: React.FunctionComponent<
  EmbarkProviderProps
> = props => (
  <PartnerContext.Provider value={{ partner: props.partner }}>
    <ExternalRedirectContext.Provider value={props.externalRedirects}>
      <ApiContext.Provider value={props.resolvers}>
        <KeywordsContext.Provider value={props.data.keywords}>
          <KeyValueStore initial={props.initialStore}>
            <StoreListener {...props}>{props.children}</StoreListener>
          </KeyValueStore>
        </KeywordsContext.Provider>
      </ApiContext.Provider>
    </ExternalRedirectContext.Provider>
  </PartnerContext.Provider>
);
