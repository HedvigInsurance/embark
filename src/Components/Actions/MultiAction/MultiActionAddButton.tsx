import * as React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { AddItemButton } from './AddItemButton'
import { CardContainer, cardWidth } from './MultiActionCardComponents'

const ExitAnimation = styled(motion.div)`
  display: inline-block;
  z-index: 2000;
  position: relative;
`

interface MultiActionAddButtonProps {
  label: string
  onClick: () => void
}

export const MultiActionAddButton = (props: MultiActionAddButtonProps) => (
  <ExitAnimation
    initial={{ opacity: 0, width: 0 }}
    animate={{ opacity: 1, width: cardWidth + 40 }}
    exit={{ opacity: 0, width: 0 }}
    transition={{
      ease: 'easeOut',
      duration: 0.3,
      delay: 0.3,
    }}
  >
    <CardContainer>
      <AddItemButton text={props.label} onClick={props.onClick} />
    </CardContainer>
  </ExitAnimation>
)
