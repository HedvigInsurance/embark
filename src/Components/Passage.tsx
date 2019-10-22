import * as React from "react"
import styled from "@emotion/styled"
import { fonts } from "@hedviginsurance/brand"
import { motion } from "framer-motion"

import { SelectOption } from "./SelectOption"

type PassageProps = {
    passage: any,
    changePassage: (name: String) => void
}

const ChatContainer = styled.div`
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;
`

const ChatPadding = styled.div`
    padding: 10vh 20vw;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
`

const MessageContainer = styled.div`
    padding-bottom: 5px
`

const Message = styled.p`
    display: inline-block;
    background-color: white;
    max-width: 300px;
    padding: 15px;
    border-radius: 20px;
    font-family: ${fonts.CIRCULAR};
    line-height: 25px;
`

const Actions = styled.div`
    display: flex;
`

const messageListMotionVariants = {
    visible: {
      opacity: 1,
      transition: {
          delay: 0.15,
        when: "beforeChildren",
        staggerChildren: 0.20,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  }

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

export const Passage = (props: PassageProps) => {
    return <ChatContainer>
        <ChatPadding>
            <div>
                <motion.ul
                    key={props.passage.name}
                    initial="hidden"
                    animate="visible"
                    variants={messageListMotionVariants}>
                    {props.passage.messages.map(message =>
                        <MessageContainer>
                            <motion.li
                                key={message.text}
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
                                <Message>{message.text}</Message>
                            </motion.li>
                        </MessageContainer>
                    )}
                </motion.ul>
            </div>
            <motion.div
                key={props.passage.name}
                initial={{
                    opacity: 0,
                    y: 150
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 100
                }}>
                <Actions>
                {props.passage.action && props.passage.action.options.map(option =>
                    <SelectOption
                        label={option.link.label}
                        key={option.link.label}
                        onClick={() => props.changePassage(option.link.name)} />
                )}
                </Actions>
            </motion.div>
        </ChatPadding>
    </ChatContainer>
}