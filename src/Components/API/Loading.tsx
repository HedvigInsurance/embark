import * as React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { colorsV2 } from "@hedviginsurance/brand";

const DotOuterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const DotContainer = styled.div<{ addBorder: boolean }>`
  display: flex;
  flex-direction: row;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 23px;
  box-sizing: content-box;
  width: 40px;
  background-color: ${colorsV2.white};
  ${props => props.addBorder && `border: 1px solid ${colorsV2.lightgray};`};
`;

const Dot = styled(motion.div)`
  width: 8px;
  margin-left: 3px;
  margin-right: 3px;
  height: 8px;
  border-radius: 4px;
  background-color: ${colorsV2.semilightgray};
`;

interface LoadingProps {
  addBorder?: boolean;
}

export const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (props, ref) => (
    <DotOuterContainer ref={ref}>
      <DotContainer addBorder={props.addBorder || false}>
        <Dot
          animate={{ y: [8, -8] }}
          transition={{ ease: "easeInOut", flip: Infinity, duration: 0.3 }}
        />
        <Dot
          animate={{ y: [8, -8] }}
          transition={{
            ease: "easeInOut",
            flip: Infinity,
            duration: 0.3,
            delay: 0.15
          }}
        />
        <Dot
          animate={{ y: [8, -8] }}
          transition={{
            ease: "easeInOut",
            flip: Infinity,
            duration: 0.3,
            delay: 0.3
          }}
        />
      </DotContainer>
    </DotOuterContainer>
  )
);
