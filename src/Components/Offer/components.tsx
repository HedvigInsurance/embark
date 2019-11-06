import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";

const Heading = styled.h1`
  font-family: ${fonts.GEOMANIST};
  font-size: 64px;
  line-height: 64px;
  font-weight: 700;
  letter-spacing: -0.91px;
`;

export const WhiteHeading = styled(Heading)`
  color: ${colorsV2.white};
`;

export const BlackHeading = styled(Heading)`
  color: ${colorsV2.black};
`;

export const PreHeading = styled.div`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: 2.67px;
  color: ${colorsV2.gray};
  text-transform: uppercase;
  margin-bottom: 25px;
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 32px;
  margin: 0 auto;
  max-width: 1264px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
`;

export const Column = styled.div`
  display: flex;
  flex-flow: column;
  max-width: 760px;
  flex-grow: 0;
  padding-right: 110px;
  box-sizing: border-box;
`;
