import * as React from "react";
import InputMask from "react-input-mask";
import { ValuesOfCorrectType } from "../../../node_modules/graphql/validation/rules/ValuesOfCorrectType";
export type MaskType = "PersonalNumber" | "PostalCode";

const resolveMask = (m: MaskType): string => {
  if (m === "PersonalNumber") {
    return "999999-9999";
  }

  if (m === "PostalCode") {
    return "999 99";
  }

  return "";
};

export const unmaskValue = (value: string, m?: MaskType): string => {
  if (!m) {
    return value;
  }

  if (m === "PersonalNumber") {
    return value.replace(/-/, "");
  }

  if (m === "PostalCode") {
    return value.replace(/\s+/, "");
  }

  return value;
};

interface MaskComponentProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

function wrapWithMask<T>(
  Component: React.ComponentType<T>,
  mask: MaskType | undefined
) {
  return (props: T & MaskComponentProps) => {
    if (mask) {
      const { onChange, onFocus, onBlur, value } = props;
      return (
        <InputMask
          maskChar={null}
          mask={resolveMask(mask)}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
        >
          {(inputProps: any) => <Component {...inputProps} {...(props as T)} />}
        </InputMask>
      );
    }
    return <Component {...props} />;
  };
}

export { wrapWithMask };
