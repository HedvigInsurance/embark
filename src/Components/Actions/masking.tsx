import * as React from "react";
import InputMask, { Props as InputMaskProps } from "react-input-mask";
export type MaskType = "PersonalNumber" | "PostalCode";

const PERSONAL_NUMBER_REGEX = /^[0-9]{6}[-]?[0-9]{4}$/;
const POSTAL_CODE_REGEX = /^[0-9]{3} [0-9]{2}$/;

export const isValid = (m: MaskType | undefined, value: string): boolean => {
  if (m === "PersonalNumber") {
    return PERSONAL_NUMBER_REGEX.test(value);
  }

  if (m === "PostalCode") {
    return POSTAL_CODE_REGEX.test(value);
  }

  return true;
};

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
  mask?: MaskType;
}

export function wrapWithMask<T>(
  Component: React.ComponentType<T>,
  mask?: MaskType
): React.ComponentType<T & MaskComponentProps> {
  const PotentiallyMasked: React.FunctionComponent<
    MaskComponentProps & T
  > = props => {
    const { mask, onChange, onFocus, onBlur, value, ...rest } = props;
    if (mask) {
      return (
        <InputMask
          maskChar={null}
          mask={resolveMask(mask)}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
        >
          {(inputProps: any) => <Component {...inputProps} {...rest} />}
        </InputMask>
      );
    }

    return <Component {...props} />;
  };

  return PotentiallyMasked;
}
