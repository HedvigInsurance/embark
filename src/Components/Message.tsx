import * as React from "react"
import styled from "@emotion/styled"
import { fonts, colors } from "@hedviginsurance/brand"
import { motion } from "framer-motion"

import { StoreContext } from "./KeyValueStore"
import { getTextContent, replacePlaceholders, MessageBody } from "./Common"

type MessageProps = {
    message: any,
    isResponse: boolean
}

const MessageContainer = styled.div`
    padding-bottom: 5px
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

export const Message = (props: MessageProps) => {
    return (
        <StoreContext.Consumer>
            {({ store }) => 
                {
                    const text = getTextContent(store, props.message)

                    if (!text) {
                        return null
                    }

                    return (
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
                                <MessageBody isResponse={props.isResponse}>{replacePlaceholders(store, text)}</MessageBody>
                            </motion.li>
                        </MessageContainer>
                    )
                }
            }
        </StoreContext.Consumer>
    )
}
