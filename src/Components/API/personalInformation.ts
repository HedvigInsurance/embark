import { ApiComponent, PersonalInformationApiComponent } from "./apiComponent";
import { useLazyQuery } from "@apollo/react-hooks";
import personalInformationQuery from "./personalInformation.graphql";

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

export const usePersonalInformationQuery = store =>
  useLazyQuery<Data, Variables>(personalInformationQuery, {
    variables: {
      input: {
        personalNumber: store.personalNumber
      }
    }
  });

export const handlePersonalInformationApiResult = (
  component: PersonalInformationApiComponent,
  error,
  data: Data,
  setValue,
  changePassage
) => {
  if (error) {
    console.error("got error:", error);
    changePassage(component.data.error.name);
  }

  if (data) {
    if (data.personalInformation) {
      Object.entries(data.personalInformation).forEach(([key, value]) =>
        setValue(key, value)
      );
      changePassage(component.data.match.name);
    } else {
      changePassage(component.data.noMatch.name);
    }
  }
};
