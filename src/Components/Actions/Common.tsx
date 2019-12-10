import * as React from "react";
import styled from "@emotion/styled";
import { motion, MotionProps } from "framer-motion";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { Loading } from "../API/Loading";

interface Focusable {
  isFocused: boolean;
}

export const CardPrimitive = styled(motion.form)<Focusable>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  background-color: ${colorsV2.white};
  transition: all 250ms;

  ${props =>
    props.isFocused &&
    `
        box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
        transform: translateY(-3px);
    `};
`;

interface CardProps {
  loading?: boolean;
  isFocused: boolean;
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const LoadingContainer = styled(motion.div)`
  position: absolute;
  top: 50%;
`;

const FormContents = styled(motion.div)`
  text-align: center;
`;

export const Card: React.FC<CardProps> = ({ loading, children, ...rest }) => (
  <CardPrimitive {...rest} style={{ minWidth: loading ? "0px" : "250px" }}>
    {loading && (
      <LoadingContainer
        initial={{
          y: 0,
          opacity: 0
        }}
        animate={{
          y: "-50%",
          opacity: 1
        }}
        transition={{
          delay: 0.25,
          type: "spring",
          stiffness: 400,
          damping: 100
        }}
      >
        <Loading />
      </LoadingContainer>
    )}
    <motion.div
      animate={{
        width: loading ? "125px" : "auto",
        height: loading ? "60px" : "auto",
        overflow: "hidden"
      }}
      transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 100 }}
    >
      <FormContents
        animate={{
          opacity: loading ? 0 : 1
        }}
        transition={{
          ease: "easeOut",
          duration: 0.25
        }}
      >
        {children}
      </FormContents>
    </motion.div>
  </CardPrimitive>
);

export const Input = styled.input`
  margin-left: 16px;
  margin-right: 16px;
  font-size: 56px;
  line-height: 1;
  font-family: ${fonts.CIRCULAR};
  background: none;
  border: none;
  box-sizing: border-box;
  text-align: center;
  color: ${colorsV2.black};
  font-weight: 500;
  outline: 0;
  ${props =>
    `width: ${Math.max(props.size || 0, 5) /
      1.5}em;`} ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  appearance: none;
  -moz-appearance: textfield;

  ::placeholder {
    color: ${colorsV2.lightgray};
    font-family: ${fonts.CIRCULAR};
    font-size: 56px;
  }

  @media (max-width: 600px) {
    font-size: 20px;
    line-height: 1.25;

    ::placeholder {
      font-size: 20px;
      line-height: 1.25;
    }
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Spacer = styled.span`
  height: 20px;
`;

export const SubmitOnEnter = styled.input`
  display: none;
`;
