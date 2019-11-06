import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";
import { InlineDropdownAction } from "./InlineActions/InlineDropdownAction";
import { motion } from "framer-motion";
import { ContinueButton } from "../../ContinueButton";
import { AddItemButton } from "./AddItemButton";
import { RemoveItemButton } from "./RemoveItemButton";
import { Flipper, Flipped, spring } from "react-flip-toolkit";
import uuid from "uuid";
import { InlineNumberAction } from "./InlineActions/InlineNumberAction";
import { InlineSwitchAction } from "./InlineActions/InlineSwitchAction";
import { StoreContext } from "../../KeyValueStore";

type MultiActionProps = {
  passageName: string;
  action: any;
  changePassage: (name: string) => void;
};

interface Focusable {
  isFocused: boolean;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 100%;
  transition: all 250ms;

  .flipper {
    display: block;
    width: 100%;
  }
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

const cardHeight = 223;
const cardWidth = 175;

const Card = styled.form<Focusable>`
  position: relative;
  border-radius: 8px;
  background-color: ${colorsV2.white};
  display: inline-block;
  width: 100%;

  ${props =>
    props.isFocused &&
    `
        box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
        transform: translateY(-3px);
    `};
`;

const CardContainer = styled.div`
  display: inline-block;
  overflow: hidden;
  padding: 20px;
  width: 175px;
  min-height: 223px;
`;

const CardContents = styled(motion.div)`
  overflow: hidden;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${colorsV2.lightgray};
`;

const onElementAppear = el =>
  spring({
    config: { overshootClamping: true, stiffness: 280, damping: 30 },
    onUpdate: (val: number) => {
      el.style.opacity = val;
      el.style.transform = `scaleX(${val})`;
    },
    delay: 0
  });

const onExit = (el, _, removeElement) => {
  spring({
    config: { overshootClamping: true, stiffness: 280, damping: 30 },
    onUpdate: (val: number) => {
      el.style.opacity = 1 - val;
      el.style.transform = `scaleX(${1 - val})`;
    },
    delay: 0,
    onComplete: removeElement
  });

  return () => {
    el.style.opacity = "";
    removeElement();
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setItems":
      return { ...state, items: action.items };
    case "removeItem":
      return {
        ...state,
        items: state.items.filter(item => item.id != action.id)
      };
    case "addItem":
      return { ...state, items: [...state.items, action.item] };
    case "updateItem":
      const previousItem = state.items.filter(
        item => item.id == action.item.id
      )[0];
      const previousIndex = state.items.indexOf(previousItem);
      const newArray = state.items.filter(item => item.id != action.item.id);
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
      values: values
        ? values
        : props.action.data.components.reduce(
            (acc, component) => ({
              ...acc,
              [component.data.key]:
                typeof component.data.defaultValue != "undefined"
                  ? component.data.defaultValue
                  : null
            }),
            {}
          )
    };
  };

  const { store, setValue, removeValues } = React.useContext(StoreContext);
  const [state, dispatch] = React.useReducer(reducer, { items: [] });

  React.useEffect(() => {
    const storedItems = Object.keys(store)
      .filter(key => key.includes(props.action.data.key))
      .reduce((acc, key) => {
        const matches = new RegExp(/\[([0-9]+)\]([a-zA-Z]+)/g).exec(
          key.replace(props.action.data.key, "")
        );
        const index = matches[1];
        const dataKey = matches[2];

        return {
          ...acc,
          [index]: { ...(acc[index] ? acc[index] : {}), [dataKey]: store[key] }
        };
      }, {});

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
        .map(
          item =>
            !Object.keys(item.values)
              .map(key => item.values[key] === null)
              .includes(true)
        )
        .includes(false)
    );
  }, [state.items]);

  return (
    <MultiActionBase>
      <Container>
        <Flipper
          element="div"
          flipKey={`${state.items.map(item => item.id).join("")}${
            showAddButton ? "addButton" : ""
          }`}
          className="flipper"
        >
          {state.items.map(item => {
            return (
              <Flipped
                translate
                key={item.id}
                onExit={onExit}
                onAppear={onElementAppear}
                flipId={item.id}
              >
                <CardContainer>
                  <Card isFocused={false} key={item.index}>
                    <RemoveItemButton
                      onClick={() => {
                        dispatch({ type: "removeItem", id: item.id });
                      }}
                    />
                    <CardContents
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ease: "easeOut", delay: 0.3 }}
                    >
                      {props.action.data.components
                        .flatMap((e, index) => {
                          if (
                            index ==
                            props.action.data.components.length - 1
                          ) {
                            return [e];
                          }

                          return [e, { component: "Divider" }];
                        })
                        .map((component, index) => {
                          if (component.component == "Divider") {
                            return <Divider />;
                          }

                          if (component.component == "SwitchAction") {
                            return (
                              <InlineSwitchAction
                                value={item.values[component.data.key]}
                                key={index}
                                label={component.data.label}
                                onValue={value => {
                                  dispatch({
                                    type: "updateItem",
                                    item: {
                                      ...item,
                                      values: {
                                        ...item.values,
                                        [component.data.key]: value
                                      }
                                    }
                                  });
                                }}
                                defaultValue={
                                  component.data.defaultValue == "true"
                                }
                              />
                            );
                          }

                          if (component.component == "DropdownAction") {
                            return (
                              <InlineDropdownAction
                                key={index}
                                options={component.data.options}
                                label={component.data.label}
                                value={item.values[component.data.key]}
                                onValue={value => {
                                  dispatch({
                                    type: "updateItem",
                                    item: {
                                      ...item,
                                      values: {
                                        ...item.values,
                                        [component.data.key]: value
                                      }
                                    }
                                  });
                                }}
                              />
                            );
                          }

                          if (component.component == "NumberAction") {
                            return (
                              <InlineNumberAction
                                placeholder={component.data.placeholder}
                                unit={component.data.unit}
                                value={item.values[component.data.key]}
                                onValue={value => {
                                  dispatch({
                                    type: "updateItem",
                                    item: {
                                      ...item,
                                      values: {
                                        ...item.values,
                                        [component.data.key]: value
                                      }
                                    }
                                  });
                                }}
                              />
                            );
                          }

                          return null;
                        })}
                    </CardContents>
                  </Card>
                </CardContainer>
              </Flipped>
            );
          })}
          {showAddButton && (
            <Flipped
              translate
              onExit={onExit}
              onAppear={onElementAppear}
              flipId={"addButton"}
            >
              <CardContainer>
                <AddItemButton
                  key="addButton"
                  text={props.action.data.addLabel}
                  onClick={() => {
                    dispatch({
                      type: "addItem",
                      item: createItem(state.items.length)
                    });
                  }}
                />
              </CardContainer>
            </Flipped>
          )}
        </Flipper>
      </Container>
      <ButtonSpacer />
      <ContinueButton
        disabled={!isValid}
        text={props.action.data.link.label}
        onClick={() => {
          removeValues(props.action.data.key);
          state.items.forEach(item => {
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
