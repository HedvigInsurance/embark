import * as React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { Questionmark } from './Icons/Questionmark'

const TooltipIcon = styled(motion.div)`
  background-color: ${colorsV3.gray300};
  width: 28px;
  height: 28px;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  text-align: center;
  transition: all 250ms;

  .fillColor {
    transition: all 250ms;
  }

  :hover {
    background-color: ${colorsV3.purple500};
    .fillColor {
      fill: ${colorsV3.white};
    }
  }

  svg {
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const TooltipContainer = styled(motion.div)`
  position: absolute;
  top: 0px;
  right: 0px;

  @media (max-width: 768px) {
    display: none;
  }
`

const Tooltippy = styled.div`
  background-color: ${colorsV3.purple500};
  border-radius: 10px;
  color: ${colorsV3.white};
  display: flex;
  align-items: center;
  text-align: center;
  padding: 10px;
  font-family: ${fonts.FAVORIT};
  max-width: 150px;
  min-width: 35px;
  font-size: 16px;
  justify-content: center;
  transform: translateX(calc(50% - 24px));

  :after {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-top-color: ${colorsV3.purple500};
    border-width: 7px;
    margin-left: -7px;
  }
`

interface TooltipProps {
  tooltip?: {
    title: string
    description: string
  }
}

export const Tooltip: React.FunctionComponent<TooltipProps> = (props) => {
  const [showTooltip, setShowTooltip] = React.useState(false)
  return props.tooltip ? (
    <>
      <>
        <TooltipContainer
          initial="hidden"
          animate={showTooltip ? 'visible' : 'hidden'}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 125,
          }}
          variants={{
            visible: {
              opacity: 1,
              pointerEvents: 'auto',
              y: '-105%',
            },
            hidden: {
              opacity: 0,
              pointerEvents: 'none',
              y: '-90%',
            },
          }}
        >
          <Tooltippy>{props.tooltip.description}</Tooltippy>
        </TooltipContainer>
        <TooltipIcon
          onHoverStart={() => {
            setShowTooltip(true)
          }}
          onHoverEnd={() => setShowTooltip(false)}
        >
          <Questionmark />
        </TooltipIcon>
      </>
    </>
  ) : null
}
