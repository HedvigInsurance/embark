import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import {
  Container,
  Column,
  HeadingWrapper,
  HeadingBlack,
  PreHeading,
  SubSubHeadingBlack
} from "../components";
import { CompareTable } from "./CompareTable";
import { hedvigCompany, otherCompanies, insuranceProperties } from "./mock";

const Wrapper = styled.div`
  padding: 80px 0;
  background-color: ${colorsV2.offwhite};
`;

export const Compare = () => {
  return (
    <Wrapper>
      <Container>
        <Column>
          <HeadingWrapper>
            <PreHeading>Villkor</PreHeading>
            <HeadingBlack>Jämför gärna!</HeadingBlack>
          </HeadingWrapper>

          <CompareTable
            insuranceProperties={insuranceProperties}
            primaryCompany={hedvigCompany}
            otherCompanies={otherCompanies}
          />
        </Column>
      </Container>
    </Wrapper>
  );
};
