import * as React from "react";
import { Data as PData } from "./personalInformation";
import { Variables as CQVariables, Data as CQData } from "./createQuote";
import {
  personalInformationQueryMocks,
  createQuoteMocks,
  houseInformationMocks
} from "../../api-mocks";
import { Data as HData, Variables as HVariables } from "./houseInformation";

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface TApiContext {
  personalInformationApi: (personalNumber: string) => Promise<PData | Error>;
  houseInformation: (variables: HVariables) => Promise<HData | Error>;
  createQuote: (variables: CQVariables) => Promise<CQData | Error>;
}

export const ApiContext = React.createContext<TApiContext>({
  personalInformationApi: _ => {
    throw Error("Must provide an implementation for `personalInformationApi`");
  },
  houseInformation: () => {
    throw Error("Must provide an implementation for `houseInformation`");
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
      houseInformation: async _ => {
        await timeout(300);
        return houseInformationMocks[0];
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
