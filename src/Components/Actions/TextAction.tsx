import * as React from "react";
import { motion } from "framer-motion";
import { StoreContext } from "../KeyValueStore";
import { Tooltip } from "../Tooltip";
import { Card, Input, Container, Spacer } from "./Common";
import styled from "@emotion/styled";
import { ContinueButton } from "../ContinueButton";
import {
  MaskType,
  wrapWithMask,
  unmaskValue,
  isValid,
  derivedValues
} from "./masking";
import { callApi } from "../API";
import { ApiContext } from "../API/ApiContext";
import { ApiComponent } from "../API/apiComponent";

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

const Masked = wrapWithMask(BottomSpacedInput);

export const TextAction: React.FunctionComponent<Props> = props => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { store, setValue } = React.useContext(StoreContext);
  const [textValue, setTextValue] = React.useState(store[props.storeKey] || "");
  const api = React.useContext(ApiContext);

  const onContinue = () => {
    const unmaskedValue = unmaskValue(textValue, props.mask);
    const newValues: { [key: string]: any } = {
      [props.storeKey]: unmaskedValue,
      ...derivedValues(props.mask, props.storeKey, unmaskedValue)
    };
    Object.entries(newValues).forEach(([key, value]) => setValue(key, value));
    setValue(`${props.passageName}Result`, textValue);
    if (props.api) {
      setLoading(true);
      callApi(
        props.api,
        api,
        { ...store, ...newValues },
        setValue,
        props.onContinue
      );
    } else {
      props.onContinue();
    }
  };

  return (
    <Container>
      <Card
        loading={loading}
        isFocused={isFocused || isHovered}
        onSubmit={e => {
          e.preventDefault();
          onContinue();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip tooltip={props.tooltip} />
        <Masked
          mask={props.mask}
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
      </Card>
      <Spacer />
      <motion.div
        animate={{
          opacity: loading ? 0 : 1
        }}
        transition={{ ease: "easeOut", duration: 0.25 }}
      >
        <motion.div
          animate={{
            height: loading ? 0 : "auto",
            overflow: loading ? "hidden" : "inherit",
            opacity: loading ? 0 : 1
          }}
          transition={{ delay: 0.25 }}
        >
          <ContinueButton
            onClick={onContinue}
            disabled={textValue.length === 0 || !isValid(props.mask, textValue)}
            text={(props.link && props.link.label) || "Nästa"}
          />
        </motion.div>
      </motion.div>
    </Container>
  );
};
