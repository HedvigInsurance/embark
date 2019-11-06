import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";
import { WordmarkSolid } from "./Icons/WordmarkSolid";

const Wrapper = styled.div`
  width: 100%;
  height: 80px;
  position: fixed;
  z-index: 1000;
  background-color: ${colorsV2.white};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  width: 100%;
  padding: 0 32px;
  margin: 0 auto;
  max-width: 1264px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
`;

const Logo = styled(WordmarkSolid)`
  width: 93.4px;
  height: 29px;
`;

export const TopBar = () => (
  <Wrapper>
    <Container>
      <Logo />
    </Container>
  </Wrapper>
);
