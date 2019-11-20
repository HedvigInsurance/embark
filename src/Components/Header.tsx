import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand";
import { Wordmark } from "./Icons/Wordmark";

interface HeaderProps {
  passage: any;
  storyData: any;
}

interface ProgressLineProps {
  progress: number;
}

const Background = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  backdrop-filter: blur(2px);
  position: relative;
  padding: 0 10vw;
  box-sizing: border-box;
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
    <Background>
      <Wordmark />
      <ProgressLineBackground />
      <ProgressLine progress={progress} />
    </Background>
  );
};
