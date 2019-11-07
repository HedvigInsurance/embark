import * as React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

import { Action } from "./Actions/Action";
import { Message } from "./Message";
import { Response } from "./Response/Response";

import { history } from "../index";
import { BackButton } from "./BackButton";
import { Questionmark } from "./Icons/Questionmark";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import hexToRgba = require("hex-to-rgba");
import { Modal } from "./Modal";

type PassageProps = {
  passage: any;
  history: [string];
  goBack: () => void;
  changePassage: (name: String) => void;
};

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`;

const ChatPadding = styled.div`
  padding: 10vh 20vw;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const Actions = styled.div`
  display: flex;
  width: 100%;
  margin-top: 17px;
  justify-content: center;
`;

const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const HelpButtonWrapper = styled.div`
  display: flex;
  justifycontent: center;
  margin-top: 20px;
  display: none;
  @media (max-width: 550px) {
    display: flex;
  }
`;

const HelpButton = styled.button`
  background-color: ${hexToRgba(colorsV2.white, 0.2)};
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  text-align: center;
  transition: all 250ms;
  cursor: pointer;
  border: none;

  :focus {
    outline: none;
  }

  .fillColor {
    fill: ${colorsV2.white};
    transition: all 250ms;
  }

  :hover {
    background-color: ${colorsV2.white};
    .fillColor {
      fill: ${colorsV2.gray};
    }
  }

  svg {
    margin: 0 auto;
  }
`;

const HelpModalContainer = styled.div`
  padding: 24px;
`;

const HelpModalTitle = styled.h1`
  font-family: ${fonts.CIRCULAR};
  font-size: 40px;
  line-height: 56px;
  color: ${colorsV2.black};
  margin-top: 36px;
  margin-bottom: 18px;
`;

const HelpModalText = styled.p`
  font-family: ${fonts.CIRCULAR};
  font-size: 16px;
  line-height: 24px;
  color: ${colorsV2.darkgray};
  margin-bottom: 10px;
`;

const HelpModalSubtitle = styled(HelpModalText)`
  color: ${colorsV2.black};
  font-weight: 700;
`;

const messageListMotionVariants = {
  reverse: {
    opacity: 1,
    transition: {
      delay: 0.15,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.15,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  },
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren"
    }
  }
};

export const Passage = (props: PassageProps) => {
  const [isResponding, setIsResponding] = React.useState(false);
  const [messagesAnimationState, setMessagesAnimationState] = React.useState(
    "visible"
  );
  const [isShowingHelp, setIsShowingHelp] = React.useState(false);

  const shouldShowActions = !(
    isResponding || messagesAnimationState == "reverse"
  );

  const goBack = () => {
    setMessagesAnimationState("reverse");

    setTimeout(() => {
      props.goBack();
      setMessagesAnimationState("visible");
    }, 400);
  };

  React.useEffect(() => {
    return history.listen((_, action) => {
      if (action == "POP") {
        goBack();
      }
    });
  });

  return (
    <ChatContainer>
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
          {props.passage.messages.length == 0 && (
            <p>This passage has no messages</p>
          )}
          <motion.ul
            key={props.passage.name}
            initial="hidden"
            animate="visible"
            variants={messageListMotionVariants}
          >
            {props.passage.messages.map(message => (
              <Message
                key={message.text}
                isResponse={false}
                message={message}
              />
            ))}
            {isResponding && props.passage.response && (
              <Response response={props.passage.response} />
            )}
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
          }}
        >
          <BottomContent>
            {props.history.length > 1 && (
              <BackButton
                onClick={() => {
                  goBack();
                }}
              />
            )}
            <Actions>
              <Action
                key={props.passage.name}
                passageName={props.passage.name}
                action={props.passage.action}
                changePassage={name => {
                  setIsResponding(true);

                  setTimeout(() => {
                    setMessagesAnimationState("forwards");
                  }, 650);

                  setTimeout(() => {
                    setMessagesAnimationState("visible");
                    setIsResponding(false);
                    props.changePassage(name);
                  }, 1000);
                }}
              />
            </Actions>
            {props.passage.tooltips.length !== 0 && (
              <HelpButtonWrapper>
                <HelpButton
                  onClick={() => {
                    setIsShowingHelp(true);
                  }}
                >
                  <Questionmark />
                </HelpButton>
              </HelpButtonWrapper>
            )}
          </BottomContent>
        </motion.div>
      </ChatPadding>
      {props.passage.tooltips.length !== 0 && (
        <Modal
          isVisible={isShowingHelp}
          onClose={() => setIsShowingHelp(false)}
        >
          <HelpModalContainer>
            <HelpModalTitle>Information</HelpModalTitle>
            {props.passage.tooltips.map((tooltip: any) => (
              <>
                <HelpModalSubtitle>{tooltip.title}</HelpModalSubtitle>
                <HelpModalText>{tooltip.description}</HelpModalText>
              </>
            ))}
          </HelpModalContainer>
        </Modal>
      )}
    </ChatContainer>
  );
};
