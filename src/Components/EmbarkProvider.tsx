import * as React from "react";
import { KeyValueStore } from "./KeyValueStore";
import { KeywordsContext } from "./KeywordsContext";

interface EmbarkProviderProps {
  data: any;
}

export const EmbarkProvider: React.FunctionComponent<
  EmbarkProviderProps
> = props => (
  <KeywordsContext.Provider value={props.data.keywords}>
    <KeyValueStore>{props.children}</KeyValueStore>
  </KeywordsContext.Provider>
);
