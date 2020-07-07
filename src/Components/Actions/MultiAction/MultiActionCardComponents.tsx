import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { colorsV3 } from '@hedviginsurance/brand'

export const cardWidth = 175

interface Focusable {
  isFocused: boolean
}

export const Card = styled.form<Focusable>`
  position: relative;
  border-radius: 8px;
  background-color: ${colorsV3.white};

  display: inline-block;
  width: 100%;

  ${(props) =>
    props.isFocused &&
    `
        box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
        transform: translateY(-3px);
    `};
`

export const CardContainer = styled.div`
  display: inline-block;
  overflow: hidden;
  padding: 20px;
  max-width: ${cardWidth}px;
  box-sizing: content-box;
  color: ${colorsV3.gray900};
`

export const CardContents = styled(motion.div)`
  overflow: hidden;
  min-height: 223px;
`
