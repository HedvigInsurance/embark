import * as React from "react";
import { Data as PData } from "./personalInformation";
import { Variables as CQVariables, Data as CQData } from "./createQuote";
import {
  personalInformationQueryMocks,
  createQuoteMocks
} from "../../api-mocks";

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface TApiContext {
  personalInformationApi: (personalNumber: string) => Promise<PData | Error>;
  createQuote: (variables: CQVariables) => Promise<CQData | Error>;
}

export const ApiContext = React.createContext<TApiContext>({
  personalInformationApi: _ => {
    throw Error("Must provide an implementation for `personalInformationApi`");
  },
  createQuote: _ => {
    throw Error("Must provide an implementation for `createQuote`");
  }
});

export const MockApiContext: React.FunctionComponent = props => (
  <ApiContext.Provider
    value={{
      personalInformationApi: async _ => {
        await timeout(300);
        return personalInformationQueryMocks[0].result.data as PData;
      },
      createQuote: async _ => {
        await timeout(300);
        return createQuoteMocks[0].result.data as CQData;
      }
    }}
  >
    {props.children}
  </ApiContext.Provider>
);
