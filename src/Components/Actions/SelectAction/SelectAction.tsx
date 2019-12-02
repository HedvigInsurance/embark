import * as React from "react";
import styled from "@emotion/styled";
import { SelectOption } from "./SelectOption";
import { StoreContext } from "../../KeyValueStore";
import { callApi } from "../../API";
import { ApiContext } from "../../API/ApiContext";
import { Loading } from "../../API/Loading";
import {
  performExternalRedirect,
  ExternalRedirectContext
} from "../../../externalRedirect";

type SelectActionProps = {
  passageName: string;
  action: any;
  changePassage: (name: string) => void;
};

const Container = styled.div`
  display: flex;
  flex-flow: wrap;
  width: 100%;
  justify-content: center;
`;

const ARRAY_REGEX = /^\[.+,.+\]$/; // Matches values wrapped in brackets, containing at least one ','
const ARRAY_SYMBOL_REGEX = /[\[\]]/g; // Matches either '[' or ']'

const parseToArray = (value: string): string[] =>
  value.replace(ARRAY_SYMBOL_REGEX, "").split(",");

const parseKeyValues = (key: string, value: string) => {
  if (ARRAY_REGEX.test(key) && ARRAY_REGEX.test(value)) {
    const keys = parseToArray(key);
    const values = parseToArray(value);

    return keys.map((k, idx) => [k, values[idx]]);
  }

  return [[key, value]];
};

export const SelectAction: React.FunctionComponent<
  SelectActionProps
> = props => {
  const { store, setValue } = React.useContext(StoreContext);
  const [loading, setLoading] = React.useState(false);
  const api = React.useContext(ApiContext);
  const externalRedirect = React.useContext(ExternalRedirectContext);

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
                parseKeyValues(option.key, option.value).forEach(([k, v]) =>
                  setValue(k, v)
                );
              } else {
                setValue(option.key, option.link.label);
              }
            }
            setValue(`${props.passageName}Result`, option.link.label);
            if (option.api) {
              setLoading(true);
              callApi(option.api, api, store, setValue, props.changePassage);
            } else {
              if (option.externalRedirect) {
                performExternalRedirect(
                  externalRedirect,
                  option.externalRedirect
                );
              } else {
                props.changePassage(option.link.name);
              }
            }
          }}
        />
      ))}
    </Container>
  );
};
