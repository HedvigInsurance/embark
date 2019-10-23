import * as React from "react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"

import { SelectOption } from "./SelectOption"
import { Message } from "./Message";

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
                        <Message message={message} />
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