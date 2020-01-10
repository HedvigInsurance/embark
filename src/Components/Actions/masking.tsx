import * as React from "react";
import InputMask, { ReactInputMask } from "react-input-mask";
import parse from "date-fns/parse";
import differenceInYears from "date-fns/differenceInYears";

export type MaskType = "PersonalNumber" | "PostalCode" | "Email";

const PERSONAL_NUMBER_REGEX = /^[0-9]{6}[0-9]{4}$/;
const POSTAL_CODE_REGEX = /^[0-9]{3}[0-9]{2}$/;
const EMAIL_REGEX = /^.+@.+\..+$/;

export const isValid = (m: MaskType | undefined, value: string): boolean => {
  const unmaskedValue = unmaskValue(value, m);
  if (m === "PersonalNumber") {
    return PERSONAL_NUMBER_REGEX.test(unmaskedValue);
  }

  if (m === "PostalCode") {
    return POSTAL_CODE_REGEX.test(unmaskedValue);
  }

  if (m === "Email") {
    return EMAIL_REGEX.test(unmaskedValue);
  }

  return true;
};

const resolveMask = (m?: MaskType): string => {
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

export const derivedValues = (
  mask: MaskType | undefined,
  key: string,
  value: string
): { [k: string]: any } | null => {
  if (!mask) {
    return null;
  }

  if (mask === "PersonalNumber") {
    const dateOfBirth = parse(value.substring(0, 6), "yyMMdd", 0);

    return {
      [`${key}.Age`]: differenceInYears(new Date(), dateOfBirth)
    };
  }

  return null;
};

interface MaskComponentProps {
  inputRef?: React.RefObject<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  mask?: MaskType;
}

export function wrapWithMask<T>(
  Component: React.ComponentType<
    T | { ref: React.RefObject<HTMLInputElement> }
  >,
  mask?: MaskType
): React.ComponentType<T & MaskComponentProps> {
  const PotentiallyMasked: React.FunctionComponent<MaskComponentProps &
    T> = props => {
    const { mask, onChange, onFocus, onBlur, value, inputRef, ...rest } = props;
    if (mask && mask !== "Email") {
      return (
        <InputMask
          maskChar={null}
          mask={resolveMask(mask)}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
        >
          {(inputProps: any) => (
            <Component ref={inputRef} {...inputProps} {...rest} />
          )}
        </InputMask>
      );
    }

    return <Component ref={inputRef} {...props} />;
  };

  return PotentiallyMasked;
}
