import personalInformationQuery from "./personalInformation.graphql";
import { useLazyQuery } from "@apollo/react-hooks";

interface Link {
  name: string;
}

interface PersonalInformationApiComponent {
  component: "PersonalInformationApi";
  data: {
    match: Link;
    noMatch: Link;
    error: Link;
  };
}

export type ApiComponent = PersonalInformationApiComponent | undefined;

interface MaskedPersonalInformationItem {
  id: string;
  display: string;
}

interface PIData {
  personalInformation: {
    firstName: MaskedPersonalInformationItem;
    lastName: MaskedPersonalInformationItem;
    streetAddress: MaskedPersonalInformationItem;
    city: MaskedPersonalInformationItem;
    postalNumber: MaskedPersonalInformationItem;
  };
}

interface PIVariables {
  input: {
    personalNumber: string;
  };
}

const NOOP = () => {};
const EMPTY_OBJECT: any = {}; // We can do better than this in types I think
const NO_API = [NOOP, EMPTY_OBJECT];

const isPersonalInformationApiComponent = (
  t?: ApiComponent
): t is PersonalInformationApiComponent =>
  t && t.component === "PersonalInformationApi";

export const useApiComponent = (component: ApiComponent, store: any) => {
  const [getPi, piResult] = useLazyQuery<PIData, PIVariables>(
    personalInformationQuery,
    {
      variables: {
        input: {
          personalNumber: store.personalNumber
        }
      },
      fetchPolicy: "no-cache"
    }
  );

  if (isPersonalInformationApiComponent(component)) {
    return [getPi, piResult];
  }

  return NO_API;
};

export const handleErrorOrData = (
  component: ApiComponent,
  error,
  data,
  setValue,
  changePassage
) => {
  if (isPersonalInformationApiComponent(component)) {
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
  }
};
