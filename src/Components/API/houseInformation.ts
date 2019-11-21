import { ApiComponent, HouseInformationApiComponent } from "./apiComponent";

export const isHouseInformationComponent = (
  component?: ApiComponent
): component is HouseInformationApiComponent =>
  (component && component.component === "HouseInformationApi") || false;

export interface Variables {
  input: {
    streetAddress: string;
    postalNumber: string;
  };
}

export interface Data {
  houseInformation: {
    livingSpace: number;
    ancillaryArea: number;
    yearOfConstruction: number;
  } | null;
}
