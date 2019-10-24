import * as React from "react"
import styled from "@emotion/styled"
import { fonts, colors } from "@hedviginsurance/brand"
import { motion } from "framer-motion"

import { StoreContext } from "./KeyValueStore"

type MessageProps = {
    message: any,
    isResponse: boolean
}

const MessageContainer = styled.div`
    padding-bottom: 5px
`

type MessageBodyProps = {
    isResponse: boolean
}

const MessageBody = styled.p<MessageBodyProps>`
    display: inline-block;
    background-color: ${(props: MessageBodyProps) => props.isResponse ? colors.PURPLE : colors.WHITE};
    color: ${(props: MessageBodyProps) => props.isResponse ? colors.WHITE : colors.BLACK};
    max-width: 300px;
    padding: 15px;
    border-radius: 20px;
    font-family: ${fonts.CIRCULAR};
    line-height: 25px;
`

const messageListItemVariants = {
    visible: {
        opacity: 1,
        y: 0,
        rotate: 0
    },
    hidden: {
        opacity: 0,
        y: 40,
        rotate: 1
    },
  }

  interface Replacements {
    [key: string]: React.ReactNode
  }

  export const TranslationNode: React.SFC = ({ children }) => <>{children}</>

  export const placeholderRegex = new RegExp('({[a-zA-Z0-9_]+})', 'g')
  export const placeholderKeyRegex = new RegExp('([a-zA-Z0-9_]+)', 'g')
  
  export const replacePlaceholders = (
    replacements: Replacements,
    text: string,
  ) => {
    const matches = text.split(placeholderRegex).filter((value) => value)
  
    if (!matches) {
      return []
    }
  
    return matches.map((placeholder, index) => {
      if (!placeholderKeyRegex.test(placeholder)) {
        return placeholder
      }
      const key = placeholder.match(placeholderKeyRegex)![0]
  
      if (replacements[key]) {
        return <TranslationNode key={index}>{replacements[key]}</TranslationNode>
      }
  
      return placeholder
    })
  }

export const Message = (props: MessageProps) => {
    return (
        <StoreContext.Consumer>
            {({ store }) => (
                <MessageContainer>
                    <motion.li
                        key={props.message.text}
                        variants={messageListItemVariants}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 100
                        }}
                        style={{
                            transformOrigin: "0% 0%"
                        }}
                    >
                        <MessageBody isResponse={props.isResponse}>{replacePlaceholders(store, props.message.text)}</MessageBody>
                    </motion.li>
                </MessageContainer>
            )}
        </StoreContext.Consumer>
    )
}