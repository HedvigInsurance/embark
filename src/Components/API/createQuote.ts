import { ApiComponent, CreateQuoteApiComponent } from "./apiComponent";
import { useMutation } from "@apollo/react-hooks";
import createQuote from "./createQuote.graphql";
import createSession from "./createSession.graphql";

export const isCreateQuoteApiComponent = (
  t?: ApiComponent
): t is CreateQuoteApiComponent => t && t.component === "CreateQuoteApi";

interface ExtraBuilding {
  type: ExtraBuildingType;
  area: number;
  hasWaterConnected: boolean;
}

interface QuoteDetailsCore {
  street: string;
  zipCode: string;
  householdSize: number;
  livingSpace: number;
}

interface ApartmentQuoteDetails extends QuoteDetailsCore {
  type: ApartmentType;
  __typename: "ApartmentQuoteDetails";
}

interface HouseQuoteDetails extends QuoteDetailsCore {
  ancillarySpace: number;
  extraBuildings: [ExtraBuilding];
  __typename: "HouseQuoteDetails";
}

type QuoteDetails = ApartmentQuoteDetails | HouseQuoteDetails;

interface Quote {
  id: string;
  firstName: string;
  lastName: string;
  currentInsurer?: string;
  price: {
    amount: number;
    currency: string;
  };
  details: QuoteDetails;
  expiresAt: string; // TODO: This is an Instant - we should treat it as such
  __typename: "Quote";
}

interface UnderwritingLimit {
  description: string;
}

interface UnderwritingLimitsHit {
  limits: [UnderwritingLimit];
  __typename: "UnderwritingLimitsHit";
}

type QuoteResult = Quote | UnderwritingLimitsHit;

const isQuote = (result?: QuoteResult): result is Quote =>
  result && result.__typename === "Quote";
const isUnderwritingLimitsHit = (
  result?: QuoteResult
): result is UnderwritingLimitsHit =>
  result && result.__typename === "UnderwritingLimitsHit";

export interface Data {
  createQuote: QuoteResult;
}

export enum ApartmentType {
  STUDENT_RENT = "STUDENT_RENT",
  RENT = "RENT",
  STUDENT_BRF = "STUDENT_BRF",
  BRF = "BRF"
}

enum ExtraBuildingType {
  GARAGE = "GARAGE",
  CARPORT = "CARPORT",
  SHED = "SHED",
  STOREHOUSE = "STOREHOUSE",
  FRIGGEBOD = "FRIGGEBOD",
  ATTEFALL = "ATTEFALL",
  OUTHOUSE = "OUTHOUSE",
  GUESTHOUSE = "GUESTHOUSE",
  GAZEBO = "GAZEBO",
  GREENHOUSE = "GREENHOUSE",
  SAUNA = "SAUNA",
  BARN = "BARN",
  BOATHOUSE = "BOATHOUSE",
  OTHER = "OTHER"
}

interface ExtraBuildingInput {
  type: ExtraBuildingType;
  area: number;
  hasWaterConnected: boolean;
}

export interface Variables {
  input: {
    firstName: string;
    lastName: string;
    currentInsurer?: string;
    ssn: string;
    apartment?: {
      street: string;
      zipCode: string;
      householdSize: number;
      livingSpace: number;
      type: ApartmentType;
    };
    house?: {
      street: string;
      zipCode: string;
      householdSize: number;
      livingSpace: number;
      ancillarySpace: number;
      extraBuildings: [ExtraBuildingInput];
    };
  };
}

export const useCreateQuoteMutation = (client, store) => {
  const [triggerMutation, result] = useMutation<Data, Variables>(createQuote, {
    variables: {
      input: {
        firstName: store.firstName,
        lastName: store.lastName,
        currentInsurer: store.currentInsurer,
        ssn: store.personalNumber
        // TODO: Figure out how to in a nice manner map house or apartment information
      }
    }
  });

  return [
    () => {
      return client.mutate({ mutation: createSession }).then(() => {
        return;
      });
    },
    result
  ];
};

export const handleCreateQuoteApiResult = (
  component: CreateQuoteApiComponent,
  error,
  data: Data,
  setValue,
  changePassage
) => {
  if (error) {
    console.error("got error: ", error);
  }

  if (data && isUnderwritingLimitsHit(data.createQuote)) {
    // TODO: Whatever we decide here
  }

  if (data && isQuote(data.createQuote)) {
    // TODO: Whatever we decide here
  }
};
