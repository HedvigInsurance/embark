import * as React from "react";
import { Tooltip } from "../../Tooltip";
import { motion } from "framer-motion";
import { InlineTextAction } from "../InlineActions/InlineTextAction";
import styled from "@emotion/styled";
import { colorsV3, fonts } from "@hedviginsurance/brand";
import {
  CARD_COUNT_BASE_BP_SM,
  getCardCountMediaQuery,
  mediaCardCount
} from "../../Utils/cardCount";

const Card = styled.div<{ cardCount: number }>`
  background-color: ${colorsV3.white};
  padding-bottom: 36px;
  position: relative;

  &:first-of-type {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  &:last-of-type {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &:not(:last-child) {
    margin-right: 1px;
  }

  ${props => mediaCardCount(props.cardCount)`
      padding-top: 0;

      :not(:last-child) {
        margin-bottom: 1px;
        margin-right: 0;
      }
      
      &:first-of-type {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 0;
        border-top-right-radius: 8px;
      }
      &:last-of-type {
        border-top-right-radius: 0;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
      }
  `};

  @media (max-width: 600px) {
    padding: 0 0 16px 0;
  }
`;

const CardTitle = styled(motion.span)<{ pushUp?: boolean; cardCount: number }>`
  font-family: ${fonts.FAVORIT};
  font-size: 14px;
  padding-top: 16px;
  padding-left: 16px;
  display: block;
  box-sizing: content-box;
  color: ${colorsV3.gray900};

  transition: opacity 200ms, transform 150ms;

  ${props => mediaCardCount(props.cardCount)`
    transform-origin: top left;
    padding-top: 8px;
    padding-bottom: 4px;
    line-height: 1;
    font-size: 12px;
  `};
`;

export const TextEditCard: React.FC<{
  textAction: any;
  cardCount: number;
  autoFocus: boolean;
  onChange: (value: string) => void;
  value: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}> = props => {
  const matchMediaQuery = () => {
    try {
      return window.matchMedia(
        getCardCountMediaQuery(props.cardCount, CARD_COUNT_BASE_BP_SM)
      ).matches;
    } catch {
      return false;
    }
  };
  const [isSm, setIsSm] = React.useState(matchMediaQuery());

  React.useEffect(() => {
    const handleResize = () => {
      setIsSm(matchMediaQuery());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const shouldPushUp = !isSm || (props.value || "").trim().length > 0;

  return (
    <Card key={props.textAction.data.key} cardCount={props.cardCount}>
      <Tooltip tooltip={props.textAction.data.tooltip} />
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: shouldPushUp ? 0.5 : 0
        }}
        transition={{
          delay: shouldPushUp ? 0.25 : 0,
          type: "spring",
          stiffness: 400,
          damping: 100
        }}
      >
        <CardTitle
          initial={{
            height: 0
          }}
          animate={{
            height: shouldPushUp ? "12px" : "0px"
          }}
          transition={{
            delay: shouldPushUp ? 0 : 0.25,
            type: "spring",
            stiffness: 400,
            damping: 100
          }}
          cardCount={props.cardCount}
        >
          {props.textAction.data.title}
        </CardTitle>
      </motion.div>
      <InlineTextAction
        inputRef={props.inputRef}
        large={props.textAction.data.large}
        placeholder={
          isSm ? props.textAction.data.title : props.textAction.data.placeholder
        }
        strongPlaceholder={isSm}
        exampleValue={props.textAction.data.placeholder}
        onChange={props.onChange}
        value={props.value}
        mask={props.textAction.data.mask}
      />
    </Card>
  );
};
