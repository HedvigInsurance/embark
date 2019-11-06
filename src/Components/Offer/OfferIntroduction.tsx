import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { Container, Column, PreHeading, WhiteHeading } from "./components";

const Wrapper = styled.div`
  width: 100%;
  height: 845px;
  padding: 200px 0 80px 0;
  background-color: ${colorsV2.black};
  position: relative;
  box-sizing: border-box;
`;

const SummaryBox = styled.div`
  width: 420px;
  height: 500px;
  background-color: ${colorsV2.white};
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  right: 0;
  flex-shrink: 0;
`;

export const OfferIntroduction = () => (
  <Wrapper>
    <Container>
      <Column>
        <PreHeading>Försäkringsförslag</PreHeading>
        <WhiteHeading>
          Tyckte du det där var enkelt? Då skulle du uppleva vår försäkring
        </WhiteHeading>
      </Column>
      <SummaryBox />
    </Container>
  </Wrapper>
);
