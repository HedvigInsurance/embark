import * as React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { colorsV2 } from "@hedviginsurance/brand";

const DotOuterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const DotContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 23px;
  width: 40px;
  background-color: ${colorsV2.white};
`;

const Dot = styled(motion.div)`
  width: 8px;
  margin-left: 3px;
  margin-right: 3px;
  height: 8px;
  border-radius: 4px;
  background-color: ${colorsV2.semilightgray};
`;

export const Loading = React.forwardRef<HTMLDivElement>((props, ref) => (
  <DotOuterContainer ref={ref}>
    <DotContainer>
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
));
