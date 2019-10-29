import * as React from "react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"

import { Action } from "./Actions/Action"
import { Message } from "./Message";
import { Response } from "./Response/Response"

import { history } from "../index"
import { BackButton } from "./BackButton"

type PassageProps = {
    passage: any,
    history: [string],
    goBack: () => void,
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
    width: 100%;
    margin-top: 17px;
    justify-content: center;
`

const BottomContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const messageListMotionVariants = {
    reverse: {
        opacity: 1,
        transition: {
          delay: 0.15,
          when: "beforeChildren",
          staggerChildren: 0.20,
        },
    },
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
    const [messagesAnimationState, setMessagesAnimationState] = React.useState("visible")

    const shouldShowActions = !(isResponding || messagesAnimationState == "reverse")

    const goBack = () => {
        setMessagesAnimationState("reverse")

        setTimeout(() => {
            props.goBack()
            setMessagesAnimationState("visible")
        }, 400);
    }

    React.useEffect(() => {
        return history.listen((_, action) => {
            if (action == "POP") {
                goBack()
            }
        })
    })

    return <ChatContainer>
        <ChatPadding>
            <motion.div
                initial="visible"
                animate={messagesAnimationState}
                variants={{
                    visible: {
                        opacity: 1,
                        y: 0
                    },
                    reverse: {
                        opacity: 0,
                        y: 200
                    },
                    forwards: {
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
                animate={shouldShowActions ? "visible" : "hidden"}
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
                    delay: shouldShowActions ? 0.75 : 0
                }}>
                <BottomContent>
                {props.history.length > 1 && <BackButton onClick={() => {
                        goBack()
                    }} />}
                <Actions>
                    <Action
                        passageName={props.passage.name}
                        action={props.passage.action}
                        changePassage={(name) => {
                            setIsResponding(true)

                            return
                            setTimeout(() => {
                                setMessagesAnimationState("forwards")
                            }, 650)

                            setTimeout(() => {
                                setMessagesAnimationState("visible")
                                setIsResponding(false)
                                props.changePassage(name)
                            }, 1000);
                        }} />
                </Actions>
                </BottomContent>
            </motion.div>
        </ChatPadding>
    </ChatContainer>
}