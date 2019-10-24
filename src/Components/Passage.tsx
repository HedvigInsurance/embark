import * as React from "react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"

import { Action } from "./Actions/Action"
import { Message } from "./Message";
import { Response } from "./Response/Response"

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
    const [isResponding, setIsResponding] = React.useState(false)
    const [animateOutMessages, setAnimateOutMessages] = React.useState(false)

    return <ChatContainer>
        <ChatPadding>
            <motion.div
                initial="visible"
                animate={animateOutMessages ? "hidden" : "visible"}
                variants={{
                    visible: {
                        opacity: 1,
                        y: 0
                    },
                    hidden: {
                        opacity: 0,
                        y: -200
                    }
                }}
                transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 120
                }}
            >
                {props.passage.messages.length == 0 && <p>This passage has no messages</p>}
                <motion.ul
                    key={props.passage.name}
                    initial="hidden"
                    animate="visible"
                    variants={messageListMotionVariants}>
                    {props.passage.messages.map(message =>
                        <Message isResponse={false} message={message} />
                    )}
                    {(isResponding && props.passage.response) && <Response response={props.passage.response} />}
                </motion.ul>
            </motion.div>
            <motion.div
                initial="hidden"
                animate={isResponding ? "hidden" : "visible"}
                variants={{
                    visible: {
                        opacity: 1,
                        y: 0
                    },
                    hidden: {
                        opacity: 0,
                        y: 150
                    }
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 100,
                    delay: isResponding ? 0 : 0.75
                }}>
                <Actions>
                    <Action
                        action={props.passage.action}
                        changePassage={(name) => {
                            setIsResponding(true)

                            setTimeout(() => {
                                setAnimateOutMessages(true)
                            }, 650)

                            setTimeout(() => {
                                setAnimateOutMessages(false)
                                setIsResponding(false)
                                props.changePassage(name)
                            }, 1000);
                        }} />
                </Actions>
            </motion.div>
        </ChatPadding>
    </ChatContainer>
}