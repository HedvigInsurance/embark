import * as React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { colorsV2 } from '@hedviginsurance/brand'

const DotOuterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`

type Size = 'small' | 'large'

const DotContainer = styled.div<{
  addBorder: boolean
  size: Size
}>`
  display: flex;
  flex-direction: row;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 8px;
  box-sizing: content-box;
  width: 40px;
  background-color: ${colorsV2.white};
  ${(props) => props.addBorder && `border: 1px solid ${colorsV2.lightgray};`};
  ${(props) =>
    props.size == 'small' &&
    `
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 8px;
    width: 30px;
  `};
`

const Dot = styled(motion.div)<{ size: Size }>`
  width: 8px;
  margin-left: 3px;
  margin-right: 3px;
  height: 8px;
  border-radius: 4px;
  background-color: ${colorsV2.semilightgray};
  ${(props) =>
    props.size == 'small' &&
    `
    width: 4px;
    height: 4px;
    border-radius: 2px;
  `};
`

interface LoadingProps {
  addBorder?: boolean
  size?: Size
}

export const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (props, ref) => (
    <DotOuterContainer ref={ref}>
      <DotContainer
        addBorder={props.addBorder || false}
        size={props.size || 'large'}
      >
        <Dot
          size={props.size || 'large'}
          animate={{ opacity: [0.4, 1] }}
          transition={{ ease: 'easeInOut', flip: Infinity, duration: 0.8 }}
        />
        <Dot
          size={props.size || 'large'}
          animate={{ opacity: [0.4, 1] }}
          transition={{
            ease: 'easeInOut',
            flip: Infinity,
            duration: 0.8,
            delay: 0.4,
          }}
        />
        <Dot
          size={props.size || 'large'}
          animate={{ opacity: [0.4, 1] }}
          transition={{
            ease: 'easeInOut',
            flip: Infinity,
            duration: 0.8,
            delay: 0.8,
          }}
        />
      </DotContainer>
    </DotOuterContainer>
  ),
)
