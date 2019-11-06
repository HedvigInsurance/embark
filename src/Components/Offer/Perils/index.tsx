import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";
import { PerilItem } from "./PerilItem";
import {
  Container,
  Column,
  HeadingWrapper,
  HeadingBlack,
  PreHeading
} from "../components";
import { Fire, Theft } from "../../../Components/Icons/Perils";

const Wrapper = styled.div`
  padding: 80px 0;
  background-color: ${colorsV2.offwhite};
`;

const Body = styled.div`
  font-size: 20px;
  line-height: 26px;
  color: ${colorsV2.darkgray};
  margin-top: 32px;
`;

const PerilItemCollection = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  margin: 0 -4px;
`;

interface Peril {
  title: string;
  icon: JSX.Element;
}

const perils: Peril[] = [
  {
    title: "Eldsvåda",
    icon: <Fire />
  },
  {
    title: "Inbrott",
    icon: <Theft />
  }
];

export const Perils = () => (
  <Wrapper>
    <Container>
      <Column>
        <HeadingWrapper>
          <PreHeading>Skyddet</PreHeading>
          <HeadingBlack>
            {"Säkerhet genom livets alla $%*!;€&-stunder"}
          </HeadingBlack>
          <Body>
            Omfattande skydd för dig och din familj, ditt hus och dina prylar.
          </Body>
        </HeadingWrapper>

        <PerilItemCollection>
          {perils.map(peril => (
            <PerilItem title={peril.title} icon={peril.icon} />
          ))}
        </PerilItemCollection>
      </Column>
    </Container>
  </Wrapper>
);
