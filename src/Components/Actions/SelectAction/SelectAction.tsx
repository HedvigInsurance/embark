import * as React from "react";
import styled from "@emotion/styled";
import { SelectOption } from "./SelectOption";
import { StoreContext } from "../../KeyValueStore";
import { callApi } from "../../API";
import { ApiContext } from "../../API/ApiContext";
import { Loading } from "../../API/Loading";

type SelectActionProps = {
  passageName: string;
  action: any;
  changePassage: (name: string) => void;
};

const Container = styled.div`
  display: flex;
  flex-flow: wrap;
  width: 100%;

  @media all and (max-width: 1100px) {
    justify-content: center;
  }
`;

export const SelectAction: React.FunctionComponent<
  SelectActionProps
> = props => {
  const { store, setValue } = React.useContext(StoreContext);
  const [loading, setLoading] = React.useState(false);
  const api = React.useContext(ApiContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      {props.action.data.options.map((option: any) => (
        <SelectOption
          tooltip={option.tooltip}
          label={option.link.label}
          key={option.link.label}
          onClick={() => {
            if (option.key) {
              if (option.value) {
                setValue(option.key, option.value);
              } else {
                setValue(option.key, option.link.label);
              }
            }
            setValue(`${props.passageName}Result`, option.link.label);
            if (option.api) {
              setLoading(true);
              callApi(option.api, api, store, setValue, props.changePassage);
            } else {
              props.changePassage(option.link.name);
            }
          }}
        />
      ))}
    </Container>
  );
};
