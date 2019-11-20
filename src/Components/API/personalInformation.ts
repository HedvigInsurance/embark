import { ApiComponent, PersonalInformationApiComponent } from "./apiComponent";

export const isPersonalInformationApiComponent = (
  t?: ApiComponent
): t is PersonalInformationApiComponent =>
  t && t.component === "PersonalInformationApi";

export interface Data {
  personalInformation: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    postalNumber: string;
  };
}

export interface Variables {
  input: {
    personalNumber: string;
  };
}
