import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";
import { DropdownAction } from "../DropdownAction";
import { motion, AnimatePresence } from "framer-motion";
import { ContinueButton } from "../../ContinueButton";
import { AddItemButton } from "./AddItemButton";
import { RemoveItemButton } from "./RemoveItemButton";
import { FlowableList } from "./FlowableList";

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

const Card = styled(motion.form)<Focusable>`
  position: relative;
  min-height: 110px;
  border-radius: 8px;
  background-color: ${colorsV2.white};

  ${props =>
    props.isFocused &&
    `
        box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
        transform: translateY(-3px);
    `};
`;

const CardContents = styled(motion.div)`
  overflow: hidden;
`;

export const MultiAction = (props: MultiActionProps) => {
  const createItem = (index: number) => {
    return {
      index,
      components: props.action.data.components
    };
  };
  const [items, setItems] = React.useState([]);

  return (
    <MultiActionBase>
      <Container>
        <FlowableList>
          {items.map(item => {
            return (
              <Card
                initial={{ width: 0, height: 0, opacity: 0, margin: 0 }}
                animate={{ width: 150, height: 150, opacity: 1, margin: 10 }}
                exit={{ width: 0, height: 0, opacity: 0, margin: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 200
                }}
                isFocused={false}
                key={item.index}
              >
                <RemoveItemButton
                  onClick={() => {
                    setItems(items.filter(subItem => subItem != item));
                  }}
                />
                <CardContents
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ease: "easeOut", delay: 0.3 }}
                >
                  {props.action.data.components.map((component, index) => {
                    if (component.component == "DropdownAction") {
                      return (
                        <DropdownAction
                          autoResultKey={`${props.passageName}[${index}]`}
                          storeKey={`${props.action.data.key}[${item.index}]${component.data.key}`}
                          options={component.data.options}
                          label={component.data.label}
                          onContinue={() => {}}
                        />
                      );
                    }

                    return null;
                  })}
                </CardContents>
              </Card>
            );
          })}
          {items.length < props.action.data.maxAmount && (
            <motion.div
              initial={{ width: 0, height: 0, opacity: 0, margin: 0 }}
              animate={{ width: 150, height: 150, opacity: 1, margin: 10 }}
              exit={{ width: 0, height: 0, opacity: 0, margin: 0 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 200
              }}
            >
              <AddItemButton
                text={props.action.data.addLabel}
                onClick={() => {
                  setItems([...items, createItem(items.length)]);
                }}
              />
            </motion.div>
          )}
        </FlowableList>
      </Container>
      <ButtonSpacer />
      <ContinueButton
        disabled={false}
        text={props.action.data.link.label}
        onClick={() => {
          props.changePassage(props.action.data.link.name);
        }}
      />
    </MultiActionBase>
  );
};
