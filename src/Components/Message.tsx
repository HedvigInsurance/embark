import * as React from "react"
import styled from "@emotion/styled"
import { fonts } from "@hedviginsurance/brand"
import { motion } from "framer-motion"

import { StoreContext } from "./KeyValueStore"

type MessageProps = {
    message: any
}

const MessageContainer = styled.div`
    padding-bottom: 5px
`

const MessageBody = styled.p`
    display: inline-block;
    background-color: white;
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

    console.log(matches)
    console.log(replacements)
  
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
                        <MessageBody>{replacePlaceholders(store, props.message.text)}</MessageBody>
                    </motion.li>
                </MessageContainer>
            )}
        </StoreContext.Consumer>
    )
}