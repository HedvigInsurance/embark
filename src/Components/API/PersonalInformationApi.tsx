import * as React from "react";
import { useQuery } from "@apollo/react-hooks";
import { StoreContext } from "../KeyValueStore";
import query from "./personalInformation.graphql";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { colorsV2 } from "@hedviginsurance/brand";

const DotContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 8px;
  background-color: ${colorsV2.white};
`;

const Dot = styled(motion.div)`
  width: 8px;
  margin-left: 3px;
  margin-right: 3px;
  height: 8px;
  border-radius: 4px;
  background-color: ${colorsV2.semilightgray};
`;

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

  React.useEffect(() => {
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
  }, [error, data]);

  if (loading) {
    return (
      <DotContainer>
        <Dot
          animate={{ y: [8, -8] }}
          transition={{ ease: "easeInOut", flip: Infinity, duration: 0.3 }}
        />
        <Dot
          animate={{ y: [8, -8] }}
          transition={{
            ease: "easeInOut",
            flip: Infinity,
            duration: 0.3,
            delay: 0.15
          }}
        />
        <Dot
          animate={{ y: [8, -8] }}
          transition={{
            ease: "easeInOut",
            flip: Infinity,
            duration: 0.3,
            delay: 0.3
          }}
        />
      </DotContainer>
    );
  }

  return <div />;
};
