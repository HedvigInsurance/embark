import * as React from "react";
import { StoreContext } from "../KeyValueStore";

type DropdownActionProps = {
  autoResultKey: string;
  label: string;
  options: [
    {
      value: string;
      text: string;
    }
  ];
  storeKey: string | null;
  onContinue: () => void;
};

export const DropdownAction = (props: DropdownActionProps) => {
  const { store, setValue } = React.useContext(StoreContext);

  console.log(store);
  return (
    <div>
      <select
        onChange={e => {
          const value = e.target.value;
          setValue(`${props.autoResultKey}Result`, value);

          if (props.storeKey) {
            setValue(props.storeKey, value);
          }
        }}
      >
        <option value="false">{props.label}</option>
        {props.options.map(option => (
          <option value={option.value}>{option.text}</option>
        ))}
      </select>
    </div>
  );
};
