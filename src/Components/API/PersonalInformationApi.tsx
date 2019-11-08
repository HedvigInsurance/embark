import * as React from "react";
import { useQuery } from "@apollo/react-hooks";
import { StoreContext } from "../KeyValueStore";
import query from "./personalInformation.graphql";

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
  name: string;
}

interface Props {
  match: Link;
  noMatch: Link;
  error: Link;
  changePassage: (name: string) => void;
}

export const PersonalInformationApi: React.FunctionComponent<Props> = props => {
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
    return <div>This is supposed to be a really cool transition state 🙄</div>;
  }

  if (error) {
    props.changePassage(props.error.name);
  }

  if (data) {
    if (data.personalInformation) {
      props.changePassage(props.match.name);
    } else {
      props.changePassage(props.noMatch.name);
    }
  }

  return <div />;
};
