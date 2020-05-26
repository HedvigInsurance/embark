import * as React from "react";
import { Tooltip } from "../../Tooltip";
import { motion } from "framer-motion";
import { InlineNumberAction } from "./InlineNumberAction";
import styled from "@emotion/styled";
import { fonts, colorsV3 } from "@hedviginsurance/brand";
import {
  CARD_COUNT_BASE_BP_SM,
  getCardCountMediaQuery,
  mediaCardCount
} from "../../Utils/cardCount";

const Card = styled.form<{
  cardCount: number;
}>`
  position: relative;
  background-color: ${colorsV3.white};
  color: ${colorsV3.gray900};
  display: inline-block;
  max-width: 100%;
  width: 200px;

  :not(:last-of-type) {
    margin-right: 1px;
  }

  &:first-of-type {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  &:last-of-type {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  ${props => mediaCardCount(props.cardCount, CARD_COUNT_BASE_BP_SM)`
    padding-bottom: 16px;
    width: 100%;
    
    :not(:last-of-type) {
      margin-right: 0;
      margin-bottom: 1px;
    }
  `};
`;

const CardTitle = styled(motion.span)<{ cardCount: number; pushUp?: boolean }>`
  font-family: ${fonts.FAVORIT};
  font-size: 14px;
  padding-top: 15px;
  padding-left: 20px;
  display: inline-block;
  transition: opacity 200ms, transform 150ms;
  padding-bottom: 16px;
  box-sizing: content-box;

  ${props => mediaCardCount(props.cardCount, CARD_COUNT_BASE_BP_SM)`
    transform-origin: top left;
    padding: 8px 0 4px 16px; 
    line-height: 1;
    font-size: 12px;
  `};
`;

interface NumberEditCardProps {
  onSubmit: () => void;
  action: any;
  value: string;
  onChange: (value: string) => void;
  cardCount: number;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const NumberEditCard: React.FC<NumberEditCardProps> = props => {
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
    <Card
      onSubmit={e => {
        e.preventDefault();
        props.onSubmit();
      }}
      cardCount={props.cardCount}
    >
      <Tooltip tooltip={props.action.data.tooltip} />
      <motion.span
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
          {props.action.data.title}
        </CardTitle>
      </motion.span>
      <InlineNumberAction
        inputRef={props.inputRef}
        placeholder={
          isSm ? props.action.data.title : props.action.data.placeholder
        }
        unit={props.action.data.unit}
        value={props.value}
        onValue={props.onChange}
        isSm={isSm}
      />
    </Card>
  );
};
