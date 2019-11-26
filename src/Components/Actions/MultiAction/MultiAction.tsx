import * as React from "react";
import styled from "@emotion/styled";
import uuid from "uuid";
import { AnimatePresence } from "framer-motion";

import { ContinueButton } from "../../ContinueButton";
import { StoreContext, Store } from "../../KeyValueStore";
import { MultiActionAddButton } from "./MultiActionAddButton";
import { MultiActionCard } from "./MultiActionCard";

type MultiActionProps = {
  passageName: string;
  action: any;
  changePassage: (name: string) => void;
};

const Container = styled.div`
  display: block;
  white-space: nowrap;
  max-width: 100vw;
  overflow-x: scroll;
  transition: all 250ms;
`;

const MultiActionBase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ButtonSpacer = styled.div`
  height: 20px;
`;

export const getMultiActionItems = (store: Store, key: string) =>
  Object.keys(store)
    .filter(storeKey => storeKey.includes(key))
    .reduce<{ [key: string]: any }>((acc, storeKey) => {
      const matches = new RegExp(/\[([0-9]+)\]([a-zA-Z]+)/g).exec(
        storeKey.replace(key, "")
      );

      if (!matches) {
        return acc;
      }

      const index = matches[1];
      const dataKey = matches[2];

      return {
        ...acc,
        [index]: {
          ...(acc[index] ? acc[index] : {}),
          [dataKey]: store[storeKey]
        }
      };
    }, {});

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setItems":
      return { ...state, items: action.items };
    case "removeItem":
      return {
        ...state,
        items: state.items.filter((item: any) => item.id != action.id)
      };
    case "addItem":
      return { ...state, items: [...state.items, action.item] };
    case "updateItem":
      const previousItem = state.items.filter(
        (item: any) => item.id == action.item.id
      )[0];
      const previousIndex = state.items.indexOf(previousItem);
      const newArray = state.items.filter(
        (item: any) => item.id != action.item.id
      );
      newArray.splice(previousIndex, 0, action.item);

      return { ...state, items: newArray };
    default:
      return state;
  }
};

export const MultiAction = (props: MultiActionProps) => {
  const createItem = (index: number, values?: Object) => {
    return {
      index,
      id: uuid.v1(),
      components: props.action.data.components,
      values: values || {}
    };
  };

  const { store, setValue, removeValues } = React.useContext(StoreContext);
  const [state, dispatch] = React.useReducer(reducer, { items: [] });

  React.useEffect(() => {
    const storedItems = getMultiActionItems(store, props.action.data.key);

    const items = Object.keys(storedItems).map(key =>
      createItem(parseInt(key), storedItems[key])
    );

    dispatch({ type: "setItems", items });
  }, []);

  const [showAddButton, setShowAddButton] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);

  React.useEffect(() => {
    setShowAddButton(state.items.length < props.action.data.maxAmount);
    setIsValid(
      !state.items
        .map((item: any) => {
          return !(
            Object.keys(item.values)
              .map(key => item.values[key] === null)
              .indexOf(true) != -1
          );
        })
        .includes(false)
    );
  }, [state.items]);

  return (
    <MultiActionBase>
      <Container>
        <AnimatePresence>
          {state.items.map((item: any) => {
            return (
              <MultiActionCard
                key={item.id}
                action={props.action}
                item={item}
                removeItem={() => dispatch({ type: "removeItem", id: item.id })}
                updateItems={(keyValues: { [key: string]: any }) => {
                  dispatch({
                    type: "updateItem",
                    item: {
                      ...item,
                      values: {
                        ...item.values,
                        ...keyValues
                      }
                    }
                  });
                }}
              />
            );
          })}
          {showAddButton && (
            <MultiActionAddButton
              label={props.action.data.addLabel}
              onClick={() =>
                dispatch({
                  type: "addItem",
                  item: createItem(state.items.length)
                })
              }
            />
          )}
        </AnimatePresence>
      </Container>
      <ButtonSpacer />
      <ContinueButton
        disabled={!isValid}
        text={props.action.data.link.label}
        onClick={() => {
          removeValues(props.action.data.key);
          state.items.forEach((item: any) => {
            Object.keys(item.values).forEach(valueKey => {
              setValue(
                `${props.action.data.key}[${item.index}]${valueKey}`,
                item.values[valueKey]
              );
            });
          });
          setValue(`${props.passageName}Result`, state.items.length);
          props.changePassage(props.action.data.link.name);
        }}
      />
    </MultiActionBase>
  );
};
