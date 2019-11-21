import * as React from "react";
import { KeyValueStore } from "./KeyValueStore";
import { KeywordsContext } from "./KeywordsContext";
import { TApiContext, ApiContext } from "./API/ApiContext";

interface EmbarkProviderProps {
  data: any;
  resolvers: TApiContext;
}

export const EmbarkProvider: React.FunctionComponent<
  EmbarkProviderProps
> = props => (
  <ApiContext.Provider value={props.resolvers}>
    <KeywordsContext.Provider value={props.data.keywords}>
      <KeyValueStore>{props.children}</KeyValueStore>
    </KeywordsContext.Provider>
  </ApiContext.Provider>
);
