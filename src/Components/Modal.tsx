import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";
import hexToRgba = require("hex-to-rgba");

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: ${hexToRgba(colorsV2.white, 0.75)};
`;

const Container = styled.div`
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

export const Modal = (props: React.PropsWithChildren<ModalProps>) => {
  const containerRef = React.useRef(null);

  const handleClick = (e: MouseEvent) =>
    !containerRef.current.contains(e.target) && props.onClose();

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return props.isVisible ? (
    <Wrapper>
      <Container ref={containerRef}>{props.children}</Container>
    </Wrapper>
  ) : (
    <></>
  );
};
