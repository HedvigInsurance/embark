import * as React from "react"
import styled from "@emotion/styled"
import { fonts } from "@hedviginsurance/brand"
import { motion } from "framer-motion"

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

export const Message = (props: MessageProps) => {
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
                                <MessageBody>{props.message.text}</MessageBody>
                            </motion.li>
                        </MessageContainer>
    )
}