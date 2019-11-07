import * as React from "react";
import { useQuery } from "@apollo/react-hooks";
import { StoreContext } from "../KeyValueStore";
import query from "./personalInformation.graphql";

/*
<PersonalInformationApi
  match="[[VerifyAddress]]"
  noMatch="[[ManuallyInputAddress]]"
  error="[[???]]"">
</PersonalInformationApi>
*/

interface MaskedPersonalInformationItem {
  id: string;
  display: string;
}

interface Data {
  personalInformation: {
    firstName: MaskedPersonalInformationItem;
    lastName: MaskedPersonalInformationItem;
    streetAddress: MaskedPersonalInformationItem;
    city: MaskedPersonalInformationItem;
    postalNumber: MaskedPersonalInformationItem;
  };
}

interface Variables {
  input: {
    personalNumber: string;
  };
}

interface Link {
  label: string;
}

interface Props {
  match: Link;
  noMatch: Link;
  error: Link;
}

export const PersonalInformationApi: React.FunctionComponent<Props> = () => {
  const { store } = React.useContext(StoreContext);
  const { personalNumber } = store;
  const { loading, data, error } = useQuery<Data, Variables>(query, {
    variables: {
      input: {
        personalNumber
      }
    }
  });

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    <div>errored :(</div>;
  }

  if (data) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  return <pre>{JSON.stringify(store, null, 2)}</pre>;
};
