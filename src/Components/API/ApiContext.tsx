import * as React from "react";
import { Data as PData } from "./personalInformation";
import { Variables as CQVariables, Data as CQData } from "./createQuote";
import {
  personalInformationQueryMocks,
  createQuoteMocks,
  houseInformationMocks
} from "../../api-mocks";
import { Data as HData, Variables as HVariables } from "./houseInformation";
import {
  ExternalInsuranceProviderStatus,
  ExternalInsuranceProviderEventEmitter
} from "./externalInsuranceProviderData";
import EventEmitter from "eventemitter3";

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface TApiContext {
  personalInformationApi: (personalNumber: string) => Promise<PData | Error>;
  houseInformation: (variables: HVariables) => Promise<HData | Error>;
  createQuote: (variables: CQVariables) => Promise<CQData | Error>;
  track: (eventName: string, payload: { [key: string]: any }) => void;
  externalInsuranceProviderStartSession: (
    id: string,
    providerId: string,
    personalNumber: string
  ) => EventEmitter<ExternalInsuranceProviderEventEmitter>;
  externalInsuranceProviderProviderStatus: () => Promise<
    { id: string; functional: boolean }[]
  >;
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
  },
  track: () => {
    throw Error("Must provide an implementation for `track`");
  },
  externalInsuranceProviderStartSession: () => {
    throw Error(
      "Must provide an implementation for `externalInsuranceProviderStartSession`"
    );
  },
  externalInsuranceProviderProviderStatus: () => {
    throw Error(
      "Must provide an implementation for `externalInsuranceProviderProviderStatus`"
    );
  }
});

export const mockApiResolvers: TApiContext = {
  personalInformationApi: async _ => {
    await timeout(500);
    return personalInformationQueryMocks[0].result.data as PData;
  },
  houseInformation: async _ => {
    await timeout(300);
    return houseInformationMocks[0];
  },
  createQuote: async _ => {
    await timeout(300);
    return createQuoteMocks[0].result.data as CQData;
  },
  track: (eventName, payload) => {
    console.log(`Tracking ${eventName} with payload:`, payload);
  },
  externalInsuranceProviderProviderStatus: async () => {
    await timeout(300);

    return [
      { id: "FOLKSAM", functional: true },
      { id: "DINA", functional: false },
      { id: "TRYGGHANSA", functional: true },
      { id: "LANSFORSAKRINGAR", functional: true },
      { id: "IF", functional: true }
    ];
  },
  externalInsuranceProviderStartSession: () => {
    const eventEmitter = new EventEmitter<
      ExternalInsuranceProviderEventEmitter
    >();

    setTimeout(() => {
      eventEmitter.emit("data", {
        status: ExternalInsuranceProviderStatus.CONNECTING
      });
    }, 300);

    setTimeout(() => {
      eventEmitter.emit("data", {
        status: ExternalInsuranceProviderStatus.REQUIRES_AUTH
      });
    }, 2000);

    setTimeout(() => {
      eventEmitter.emit("data", {
        status: ExternalInsuranceProviderStatus.FETCHING
      });
    }, 8000);

    setTimeout(() => {
      eventEmitter.emit("data", {
        status: ExternalInsuranceProviderStatus.COMPLETED
      });
    }, 20000);

    return eventEmitter;
  }
};

export const MockApiContext: React.FunctionComponent = props => (
  <ApiContext.Provider value={mockApiResolvers}>
    {props.children}
  </ApiContext.Provider>
);
