import * as React from "react";
import { StoreContext } from "../KeyValueStore";
import { Tooltip } from "../Tooltip";
import { Card, Input, Container, Spacer } from "./Common";
import styled from "@emotion/styled";
import { ContinueButton } from "../ContinueButton";
import { MaskType, wrapWithMask, unmaskValue } from "./masking";
import { ApiComponent, useApiComponent, handleErrorOrData } from "../api";
import { Loading } from "../API/Loading";

const BottomSpacedInput = styled(Input)`
  margin-bottom: 24px;
`;

interface Props {
  passageName: string;
  storeKey: string;
  link: any;
  placeholder: string;
  mask?: MaskType;
  tooltip?: {
    title: string;
    description: string;
  };
  api?: ApiComponent;
  onContinue: () => void;
}

export const TextAction: React.FunctionComponent<Props> = props => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const { store, setValue } = React.useContext(StoreContext);
  const [textValue, setTextValue] = React.useState(store[props.storeKey] || "");

  const [callQuery, { loading, error, data }] = useApiComponent(
    props.api,
    store
  );

  React.useEffect(() => {
    handleErrorOrData(props.api, error, data, setValue, props.onContinue);
  }, [data, error]);

  const onContinue = () => {
    setValue(props.storeKey, unmaskValue(textValue, props.mask));
    setValue(`${props.passageName}Result`, textValue);
    if (props.api) {
      callQuery();
    } else {
      props.onContinue();
    }
  };

  const InputWithMask = wrapWithMask(BottomSpacedInput, props.mask);

  return (
    <Container>
      <Card
        isFocused={isFocused || isHovered}
        onSubmit={e => {
          e.preventDefault();
          onContinue();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {loading || data ? (
          <Loading />
        ) : (
          <>
            <Tooltip tooltip={props.tooltip} />
            <InputWithMask
              autoFocus
              size={Math.max(props.placeholder.length, textValue.length)}
              placeholder={props.placeholder}
              type="text"
              value={textValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTextValue(e.target.value)
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <input type="submit" style={{ display: "none" }} />
          </>
        )}
      </Card>
      <Spacer />
      <ContinueButton
        onClick={onContinue}
        disabled={textValue.length == 0}
        text={(props.link && props.link.label) || "Nästa"}
      />
    </Container>
  );
};
