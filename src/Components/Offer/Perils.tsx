import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { Container, Column, BlackHeading, PreHeading } from "./components";

const Wrapper = styled.div`
  padding: 80px 0;
  background-color: ${colorsV2.offwhite};
`;

export const Perils = () => (
  <Wrapper>
    <Container>
      <Column>
        <PreHeading>Skyddet</PreHeading>
        <BlackHeading>
          {"Säkerhet genom livets alla $%*!;€&-stunder"}
        </BlackHeading>
      </Column>
    </Container>
  </Wrapper>
);
