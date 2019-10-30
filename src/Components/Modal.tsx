import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";
import hexToRgba = require("hex-to-rgba");
import { motion } from "framer-motion";
import { Cross } from "../Components/Icons/Cross";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const Wrapper = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: ${hexToRgba(colorsV2.white, 0.75)};
`;

const Container = styled(motion.div)`
  position: relative;

  width: 500px;
  padding: 24px;
  max-width: calc(100% - 32px);
  min-height: 400px;
  max-height: calc(100vh - 32px);
  background: ${colorsV2.white};
  border-radius: 9px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  overflow-x: scroll;
`;

const CloseButton = styled.button`
  width: 26px;
  height: 26px;
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  background-color: ${colorsV2.gray};
  border-radius: 50%;
  border: none;
  cursor: pointer;

  :focus {
    outline: none;
  }

  :hover {
    background-color: ${colorsV2.darkgray};
  }

  svg {
    width: 100%;
    height: 100%;
    fill: ${colorsV2.white};
  }
`;

export const Modal = (props: React.PropsWithChildren<ModalProps>) => {
  const containerRef = React.useRef(null);

  const handleClick = (e: MouseEvent) =>
    !containerRef.current.contains(e.target) && props.onClose();

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <Wrapper
      initial={"hidden"}
      animate={props.isVisible ? "visible" : "hidden"}
      transition={{
        type: "spring"
      }}
      variants={{
        visible: {
          opacity: 1,
          visibility: "visible"
        },
        hidden: {
          opacity: 0,
          visibility: "hidden"
        }
      }}
    >
      <Container
        ref={containerRef}
        initial={"hidden"}
        animate={props.isVisible ? "visible" : "hidden"}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          delay: 0.05
        }}
        variants={{
          visible: {
            opacity: 1,
            transform: "translateX(-50%) translateY(-50%) scale(1)"
          },
          hidden: {
            opacity: 0,
            transform: "translateX(-50%) translateY(-50%) scale(0.9)"
          }
        }}
      >
        {props.children}
        <CloseButton onClick={() => props.onClose()}>
          <Cross />
        </CloseButton>
      </Container>
    </Wrapper>
  );
};
