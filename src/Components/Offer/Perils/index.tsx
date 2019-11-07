import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { PerilItem } from "./PerilItem";
import {
  Container,
  Column,
  HeadingWrapper,
  HeadingBlack,
  PreHeading
} from "../components";
import {
  Fire,
  Theft,
  Storm,
  WaterLeak,
  Lock,
  BaseballBat,
  LegalDispute,
  Plane,
  Alarm,
  Plus,
  WhiteGoods,
  WetPhone
} from "../../../Components/Icons/Perils";
import { Modal } from "../../../Components/Modal";

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

const PerilModalHeader = styled.div`
  width: 100%;
  height: 178px;
  background-color: ${colorsV2.lightgray};
  display: flex;
  justify-content: center;
`;

const PerilModalTitle = styled.div`
  font-family: ${fonts.GEOMANIST};
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 2.67px;
  color: ${colorsV2.black};
  text-align: center;
  text-transform: uppercase;
  padding: 28px 0;
  box-sizing: border-box;
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
    title: "Vattenläcka",
    icon: <WaterLeak />
  },
  {
    title: "Oväder",
    icon: <Storm />
  },
  {
    title: "Inbrott",
    icon: <Lock />
  },
  {
    title: "Stöld",
    icon: <Theft />
  },
  {
    title: "Skadegörelse",
    icon: <BaseballBat />
  },
  {
    title: "Juridisk tvist",
    icon: <LegalDispute />
  },
  {
    title: "Resetrubbel",
    icon: <Plane />
  },
  {
    title: "Överfall",
    icon: <Alarm />
  },
  {
    title: "Sjuk på resa",
    icon: <Plus />
  },
  {
    title: "Vitvaror",
    icon: <WhiteGoods />
  },
  {
    title: "Drulle",
    icon: <WetPhone />
  }
];

export const Perils = () => {
  const [isShowingPeril, setIsShowingPeril] = React.useState(false);

  return (
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
              <PerilItem
                title={peril.title}
                icon={peril.icon}
                onClick={() => setIsShowingPeril(true)}
              />
            ))}
          </PerilItemCollection>

          <Modal
            isVisible={isShowingPeril}
            onClose={() => setIsShowingPeril(false)}
          >
            <PerilModalHeader>
              <PerilModalTitle>Skyddet</PerilModalTitle>
            </PerilModalHeader>
          </Modal>
        </Column>
      </Container>
    </Wrapper>
  );
};
