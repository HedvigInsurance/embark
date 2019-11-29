import { ApiComponent, CreateQuoteApiComponent } from "./apiComponent";

export const isCreateQuoteApiComponent = (
  t?: ApiComponent
): t is CreateQuoteApiComponent =>
  (t && t.component === "CreateQuoteApi") || false;

interface ExtraBuilding {
  type: ExtraBuildingType;
  area: number;
  hasWaterConnected: boolean;
}
interface ApartmentQuoteDetails {
  street: string;
  zipCode: string;
  householdSize: number;
  livingSpace: number;
  type: ApartmentType;
  __typename: "ApartmentQuoteDetails";
}

interface HouseQuoteDetails {
  street: string;
  zipCode: string;
  householdSize: number;
  livingSpace: number;
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

export const isQuote = (result?: QuoteResult): result is Quote =>
  (result && result.__typename === "Quote") || false;

export const isUnderwritingLimitsHit = (
  result?: QuoteResult
): result is UnderwritingLimitsHit =>
  (result && result.__typename === "UnderwritingLimitsHit") || false;

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

export interface ExtraBuildingInput {
  type: ExtraBuildingType;
  area: number;
  hasWaterConnected: boolean;
}

export interface Variables {
  input: {
    id: string; // UUID
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
      extraBuildings: ExtraBuildingInput[];
    };
  };
}
