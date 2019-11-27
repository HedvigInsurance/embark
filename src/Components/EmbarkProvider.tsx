import * as React from "react";
import { KeyValueStore, Store, StoreContext } from "./KeyValueStore";
import { KeywordsContext } from "./KeywordsContext";
import { TApiContext, ApiContext } from "./API/ApiContext";

interface EmbarkProviderProps {
  data: any;
  resolvers: TApiContext;
  onStoreChange?: (store: Store) => void;
}

const Inner: React.FunctionComponent<EmbarkProviderProps> = props => {
  const { store } = React.useContext(StoreContext);

  React.useEffect(() => {
    props.onStoreChange(store);
  }, [store]);

  return <>{props.children}</>;
};

export const EmbarkProvider: React.FunctionComponent<
  EmbarkProviderProps
> = props => (
  <ApiContext.Provider value={props.resolvers}>
    <KeywordsContext.Provider value={props.data.keywords}>
      <KeyValueStore>
        <Inner {...props}>{props.children}</Inner>
      </KeyValueStore>
    </KeywordsContext.Provider>
  </ApiContext.Provider>
);
