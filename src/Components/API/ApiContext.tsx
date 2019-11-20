import * as React from "react";
import { Data as PData } from "./personalInformation";
import { Variables as CQVariables, Data as CQData } from "./createQuote";
import { personalInformationQueryMocks, createQuoteMocks } from "src/api-mocks";

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

export interface TApiContext {
  personalInformationApi: (personalNumber: string) => Promise<PData | Error>;
  createQuote: (variables: CQVariables) => Promise<CQData | Error>;
}

export const ApiContext = React.createContext<TApiContext>({
  personalInformationApi: () => {
    throw Error("Must provide an implementation for `personalInformationApi`");
  },
  createQuote: () => {
    throw Error("Must provide an implementation for `createQuote`");
  }
});

export const MockApiContext: React.FunctionComponent = props => (
  <ApiContext.Provider
    value={{
      personalInformationApi: async () => {
        await timeout(300);
        return personalInformationQueryMocks[0].result.data;
      },
      createQuote: async () => {
        await timeout(300);
        return createQuoteMocks[0].result.data;
      }
    }}
  >
    {props.children}
  </ApiContext.Provider>
);
