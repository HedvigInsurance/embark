import * as React from "react";
import InputMask from "react-input-mask";
export type MaskType = "PersonalNumber" | "PostalCode";

const resolveMask = (m: MaskType): string => {
  if (m === "PersonalNumber") {
    return "999999-9999";
  }

  if (m === "PostalCode") {
    return "999 99";
  }
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
};

export const wrapWithMask = (Component, mask) => props => {
  if (mask) {
    const { onChange, onFocus, onBlur, value, ...rest } = props;
    return (
      <InputMask
        maskChar={null}
        mask={resolveMask(mask)}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
      >
        {inputProps => <Component {...inputProps} {...rest} />}
      </InputMask>
    );
  }
  return <Component {...props} />;
};
