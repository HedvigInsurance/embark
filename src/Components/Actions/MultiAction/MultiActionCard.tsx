import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";
import { motion } from "framer-motion";

import { RemoveItemButton } from "./RemoveItemButton";

import { InlineDropdownAction } from "../InlineActions/InlineDropdownAction";
import { InlineNumberAction } from "./InlineNumberAction";
import { InlineSwitchAction } from "../InlineActions/InlineSwitchAction";
import {
  Card,
  CardContainer,
  CardContents,
  cardWidth
} from "./MultiActionCardComponents";

const ExitAnimation = styled(motion.div)`
  display: inline-block;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${colorsV2.lightgray};
`;

interface MultiActionCardProps {
  action: any;
  item: any;
  updateItems: (items: { [key: string]: any }) => void;
  removeItem: () => void;
}

const getOptionTextByValue = (
  options: [{ value: string; text: string }],
  value: string
) => {
  const option = options.find(option => option.value === value);
  return option && option.text;
};

const componentForItem = (props: MultiActionCardProps) =>
  props.action.data.components
    .flatMap((e: any, index: number) => {
      if (index == props.action.data.components.length - 1) {
        return [e];
      }

      return [e, { component: "Divider" }];
    })
    .map((component: { component: string; data: any }, index: number) => {
      if (component.component == "Divider") {
        return <Divider key={index} />;
      }

      if (component.component == "SwitchAction") {
        return (
          <InlineSwitchAction
            value={props.item.values[component.data.key]}
            key={index}
            label={component.data.label}
            onValue={value =>
              props.updateItems({ [component.data.key]: value })
            }
            defaultValue={component.data.defaultValue == "true"}
          />
        );
      }

      if (component.component == "DropdownAction") {
        return (
          <InlineDropdownAction
            key={index}
            options={component.data.options}
            label={component.data.label}
            value={props.item.values[component.data.key]}
            onValue={value =>
              props.updateItems({
                [component.data.key]: value,
                [`${component.data.key}.Label`]: getOptionTextByValue(
                  component.data.options,
                  value
                )
              })
            }
          />
        );
      }

      if (component.component == "NumberAction") {
        return (
          <InlineNumberAction
            placeholder={component.data.placeholder}
            unit={component.data.unit}
            value={props.item.values[component.data.key]}
            onValue={value =>
              props.updateItems({ [component.data.key]: value })
            }
          />
        );
      }

      return null;
    });

export const MultiActionCard = (props: MultiActionCardProps) => (
  <ExitAnimation
    initial={{ opacity: 0, width: 0 }}
    animate={{ opacity: 1, width: cardWidth + 40 }}
    exit={{ opacity: 0, width: 0 }}
    transition={{
      ease: "easeOut",
      duration: 0.3
    }}
  >
    <CardContainer>
      <Card isFocused={false} key={props.item.index}>
        <RemoveItemButton onClick={props.removeItem} />
        <CardContents
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", delay: 0.3 }}
        >
          {componentForItem(props)}
        </CardContents>
      </Card>
    </CardContainer>
  </ExitAnimation>
);
