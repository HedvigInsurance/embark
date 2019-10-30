import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";
import hexToRgba = require("hex-to-rgba");

interface ModalProps {
  isVisible: boolean;
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
`;

export const Modal = (props: ModalProps) => {
  return (
    <Wrapper onClick={() => alert()}>
      <Container>Hej</Container>
    </Wrapper>
  );
};
