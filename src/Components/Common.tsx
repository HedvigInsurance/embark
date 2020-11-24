import { passes } from '../Utils/ExpressionsUtil'
import * as React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import {
  getPlaceholderKeyRegex,
  getPlaceholderRegex,
} from '@hedviginsurance/textkeyfy'

export interface ExpressionTextNode {
  text: string
  expressions: any
}

export interface Replacements {
  [key: string]: React.ReactNode
}

export const TranslationNode: React.FC = ({ children }) => <>{children}</>

export const replacePlaceholders = (
  replacements: Replacements,
  text: string,
) => {
  const matches = text.split(getPlaceholderRegex()).filter((value) => value)

  if (!matches) {
    return []
  }

  return matches.map((placeholder, index) => {
    if (!getPlaceholderKeyRegex().test(placeholder)) {
      return placeholder
    }
    const key = placeholder.match(getPlaceholderKeyRegex())![0]

    if (replacements[key]) {
      return <TranslationNode key={index}>{replacements[key]}</TranslationNode>
    }

    return placeholder
  })
}

export const getTextContent = (store: any, node: ExpressionTextNode) => {
  if (node.expressions.length > 0) {
    const passableExpressions = node.expressions.filter((expression: any) => {
      return passes(store, expression)
    })

    if (passableExpressions.length == 0) {
      return null
    }

    return passableExpressions[0].text
  }

  return node.text
}

type MessageBodyProps = {
  isResponse: boolean
}

export const MessageBody = styled.p<MessageBodyProps>`
  display: inline-block;
  background-color: ${(props: MessageBodyProps) =>
    props.isResponse ? colorsV3.white : colorsV3.gray800};
  color: ${(props: MessageBodyProps) =>
    props.isResponse ? colorsV3.gray900 : colorsV3.white};
  max-width: 300px;
  padding: 22px;
  padding-bottom: 10px;
  padding-top: 10px;
  border-radius: 8px;
  font-family: ${fonts.FAVORIT};
  line-height: 25px;
  font-size: 16px;

  @media (max-width: 320px) {
    font-size: 14px;
  }
`

export const MessageAnimation: React.FunctionComponent = (props) => (
  <motion.li
    variants={{
      visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
      },
      hidden: {
        opacity: 0,
        y: 40,
        rotate: 1,
      },
    }}
    exit={{
      height: 0,
      opacity: 0,
      rotate: 1,
    }}
    transition={{
      type: 'spring',
      stiffness: 260,
      damping: 100,
    }}
    style={{
      transformOrigin: '0% 0%',
    }}
  >
    {props.children}
  </motion.li>
)
