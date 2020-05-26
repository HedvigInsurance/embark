import * as React from "react";
import styled from "@emotion/styled";
import { colorsV3 } from "@hedviginsurance/brand";
import hexToRgba from "hex-to-rgba";
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
`;

const Background = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: ${hexToRgba(colorsV3.black, 0.75)};
`;

const Position = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 500px;
  max-width: calc(100% - 32px);
`;

const Container = styled(motion.div)`
  position: relative;
  padding: 24px;
  background: ${colorsV3.white};
  border-radius: 9px;
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
  background-color: ${colorsV3.gray500};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: background-color 250ms;

  :focus {
    outline: none;
  }

  :hover {
    background-color: ${colorsV3.gray700};
  }

  svg {
    width: 40%;
    height: 40%;
    fill: ${colorsV3.white};
    transform: translateX(75%);
  }
`;

export const Modal = (props: React.PropsWithChildren<ModalProps>) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent) => {
    if (containerRef && containerRef.current && e.target) {
      !containerRef.current.contains(e.target as HTMLDivElement) &&
        props.onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <Wrapper
      initial={"hidden"}
      animate={props.isVisible ? "visible" : "hidden"}
      variants={{
        visible: {
          display: "block"
        },
        hidden: {
          display: "none",
          transition: {
            delay: 0.5
          }
        }
      }}
    >
      <Background
        initial={"hidden"}
        animate={props.isVisible ? "visible" : "hidden"}
        transition={{
          type: "spring"
        }}
        variants={{
          visible: {
            opacity: 1
          },
          hidden: {
            opacity: 0
          }
        }}
      >
        <Position
          initial={"hidden"}
          animate={props.isVisible ? "visible" : "hidden"}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 100
          }}
          variants={{
            visible: {
              opacity: 1,
              transform: "translateX(-50%) translateY(-50%) scale(1)",
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 100,
                delay: 0.15
              }
            },
            hidden: {
              opacity: 0,
              transform: "translateX(-50%) translateY(50%) scale(0.9)"
            }
          }}
        >
          <Container
            drag="y"
            dragElastic={0.2}
            dragTransition={{ min: 0, max: 0 }}
            ref={containerRef}
            onDragEnd={(event, info) => {
              if (info.point.y > 20) {
                props.onClose();
              }
            }}
          >
            {props.children}
            <CloseButton onClick={() => props.onClose()}>
              <Cross />
            </CloseButton>
          </Container>
        </Position>
      </Background>
    </Wrapper>
  );
};
