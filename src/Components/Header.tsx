import * as React from 'react'
import styled from '@emotion/styled'
import { colorsV2 } from '@hedviginsurance/brand'

interface HeaderProps {
  passage: any | undefined
  storyData: any | undefined
  partnerName: string | null
  startPageLink?: string
  customTrailingContent?: React.ReactNode
}

interface ProgressLineProps {
  progress: number
}

const LogoLink = styled('a')`
  display: inline-block;
  color: inherit;
`

const LogoImage = styled.img`
  position: relative;
  top: 3px;
  width: auto;
  height: auto;
  max-height: 50px;
  max-width: 230px;

  @media (max-width: 375px) {
    max-height: 48px;
  }
`

const Svg = styled.svg`
  fill: currentColor;
`

export const HedvigLogo: React.FunctionComponent = () => (
  <Svg width={94} viewBox="0 0 439 124">
    <g fillRule="nonzero">
      <path d="M57.9 51.7H14.2v39H.5V1.5h13.7v39h43.7v-39h13.7v89.2H57.9zM113.4 91.8c-19 0-33.1-13.5-33.1-34.3 0-20.8 13.5-34.2 33.1-34.2 18.9 0 32.3 13.1 32.3 32.7 0 2.3-.1 4.5-.5 6.7H94.5c1 11 8.8 17.6 18.9 17.6 8.4 0 13.1-4.1 15.7-9.3h14.8c-3.8 11.5-14.3 20.8-30.5 20.8zM94.6 51.5h36.7c-.2-10.2-8.3-16.7-18.6-16.7-9.2 0-16.7 6.3-18.1 16.7zM185 23.2c8.7 0 17.8 4.1 22.9 10.4v-32h13.9v89.2h-13.9v-10c-4.2 6-12.2 11.1-23 11.1-17.5 0-31.3-14.1-31.3-34.6 0-20.6 13.8-34.1 31.4-34.1zm2.8 12c-10.2 0-20.1 7.7-20.1 22s9.9 22.7 20.1 22.7c10.4 0 20.1-8.1 20.1-22.4 0-14.3-9.7-22.3-20.1-22.3zM243.6 24.3l18.8 54.1 18.8-54.1h14.6l-25.3 66.4h-16.4l-25.2-66.4zM357.3 23.2c10.8 0 18.9 5.1 23 10.7v-9.6h13.9v67.5c0 18.1-11.7 31.7-32.4 31.7-17.7 0-30.8-8.8-32.5-23.5h13.6c2 6.9 9.4 11.6 18.9 11.6 10.6 0 18.6-6.5 18.6-19.8V80.7c-4.2 5.7-12.2 11.1-23 11.1-17.5 0-31.3-14.1-31.3-34.6-.2-20.5 13.7-34 31.2-34zm2.9 12c-10.2 0-20.1 7.7-20.1 22s9.9 22.7 20.1 22.7c10.4 0 20.1-8.1 20.1-22.4 0-14.3-9.8-22.3-20.1-22.3zM304.2 24.3H318v66.4h-13.7V24.3zM303.1 8.4c0-4.5 3.5-8 8-8 4.4 0 7.9 3.5 7.9 8s-3.5 8-7.9 8c-4.5 0-8-3.5-8-8z" />
      <g>
        <path d="M420.1 23.2c-10 0-18.1 8.1-18.1 18.1 0 10 8.1 18.1 18.1 18.1 10 0 18.1-8.1 18.1-18.1 0-10-8.1-18.1-18.1-18.1zm0 33.7c-8.6 0-15.6-7-15.6-15.6s7-15.6 15.6-15.6 15.6 7 15.6 15.6-7 15.6-15.6 15.6z" />
        <path d="M425.5 40h-10.7v-8.6h-2.5v19.7h2.5v-8.6h10.7v8.6h2.4V31.4h-2.4z" />
      </g>
    </g>
  </Svg>
)

const Background = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  backdrop-filter: blur(2px);
  position: relative;
  padding: 0 10vw;
  box-sizing: border-box;

  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 0 25px;
  }

  @media (max-width: 375px) {
    height: 64px;
  }
`

const ProgressLineBackground = styled.div`
  width: 100%;
  height: 3px;
  position: absolute;
  bottom: 0px;
  background-color: ${colorsV2.white};
  opacity: 0.5;
  left: 0;
`

const ProgressLine = styled.div<ProgressLineProps>`
  width: ${(props) => `${props.progress}%`};
  height: 3px;
  background-color: ${colorsV2.white};
  transition: all 500ms;
  position: absolute;
  bottom: 0px;
  left: 0;
`

export const Header = (props: HeaderProps) => {
  const [progress, setProgress] = React.useState(0)
  const [totalSteps, setTotalSteps] = React.useState(0)
  const [partner, setPartner] = React.useState<null | any>(null)

  React.useEffect(() => {
    setPartner(
      props.storyData.partnerConfigs.find(
        (partner: any) =>
          partner.name === props.partnerName || partner.isDefault,
      ),
    )
  }, [props.partnerName])

  React.useEffect(() => {
    if (!props.passage || !props.storyData) {
      return
    }

    const findMaxDepth = (passageName: string, previousDepth: number = 0) => {
      const passage = props.storyData.passages.filter(
        (passage: any) => passageName == passage.name,
      )[0]
      const links = passage.allLinks.map((link: any) => link.name)

      if (links.length == 0 || !links) {
        return previousDepth
      }

      return links
        .map((link: any) => findMaxDepth(link, previousDepth + 1))
        .reduce((acc: number, curr: number) => {
          return Math.max(acc, curr)
        }, 0)
    }

    window.requestIdleCallback(
      () => {
        const passagesLeft = props.passage.allLinks
          .map((link: any) => findMaxDepth(link.name))
          .reduce((acc: number, curr: number) => {
            return Math.max(acc, curr)
          }, 0)

        if (totalSteps == 0) {
          setTotalSteps(passagesLeft)
          return
        }

        setProgress(((totalSteps - passagesLeft) / totalSteps) * 100)
      },
      { timeout: 500 },
    )
  }, [props.passage])

  return (
    <Background>
      <LogoLink href={props.startPageLink}>
        {partner ? <LogoImage src={partner.image} /> : <HedvigLogo />}
      </LogoLink>
      {props.customTrailingContent}
      <ProgressLineBackground />
      <ProgressLine progress={progress} />
    </Background>
  )
}
