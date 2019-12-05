import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";

interface HeaderProps {
  passage: any;
  storyData: any;
  partnerName: string | null;
}

interface ProgressLineProps {
  progress: number;
}

interface Alignable {
  alignment: "left" | "center";
}

const PartnerImage = styled.img`
  width: auto;
  height: auto;
  max-height: 50px;
  max-width: 230px;
  margin-top: 3px;

  @media (max-width: 375px) {
    max-height: 48px;
  }
`;

const Background = styled.div<Alignable>`
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  backdrop-filter: blur(2px);
  position: relative;
  padding: 0 10vw;
  box-sizing: border-box;
  ${props =>
    props.alignment === "center"
      ? `
  @media (max-width: 768px) {
    justify-content: center;
  }
  `
      : ""}

  @media (max-width: 375px) {
    height: 64px;
  }
`;

const ProgressLineBackground = styled.div`
  width: 100%;
  height: 3px;
  position: absolute;
  bottom: 0px;
  background-color: ${colorsV2.white};
  opacity: 0.5;
  left: 0;
`;

const ProgressLine = styled.div<ProgressLineProps>`
  width: ${props => `${props.progress}%`};
  height: 3px;
  background-color: ${colorsV2.white};
  transition: all 500ms;
  position: absolute;
  bottom: 0px;
  left: 0;
`;

export const Header = (props: HeaderProps) => {
  const [progress, setProgress] = React.useState(0);
  const [totalSteps, setTotalSteps] = React.useState(0);
  const [partner, setPartner] = React.useState<null | any>(null);

  React.useEffect(() => {
    setPartner(
      props.storyData.partnerConfigs.find(
        (partner: any) =>
          partner.name === props.partnerName || partner.isDefault
      )
    );
  }, [props.partnerName]);

  React.useEffect(() => {
    const findMaxDepth = (passageName: string, previousDepth: number = 0) => {
      const passage = props.storyData.passages.filter(
        (passage: any) => passageName == passage.name
      )[0];
      const links = passage.allLinks.map((link: any) => link.name);

      if (links.length == 0 || !links) {
        return previousDepth;
      }

      return links
        .map((link: any) => findMaxDepth(link, previousDepth + 1))
        .reduce((acc: number, curr: number) => {
          return Math.max(acc, curr);
        }, 0);
    };

    window.requestIdleCallback(
      () => {
        const passagesLeft = props.passage.allLinks
          .map((link: any) => findMaxDepth(link.name))
          .reduce((acc: number, curr: number) => {
            return Math.max(acc, curr);
          }, 0);

        if (totalSteps == 0) {
          setTotalSteps(passagesLeft);
          return;
        }

        setProgress(((totalSteps - passagesLeft) / totalSteps) * 100);
      },
      { timeout: 500 }
    );
  }, [props.passage]);

  return (
    <Background alignment={partner ? partner.alignment : "left"}>
      {partner ? <PartnerImage src={partner.image} /> : null}
      <ProgressLineBackground />
      <ProgressLine progress={progress} />
    </Background>
  );
};
