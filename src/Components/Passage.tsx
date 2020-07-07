import * as React from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'

import { Action } from './Actions/Action'
import { Message } from './Message'
import { Response } from './Response/Response'
import { MessageAnimation } from './Common'

import { BackButton } from './BackButton'
import { Questionmark } from './Icons/Questionmark'
import { colorsV2, fonts } from '@hedviginsurance/brand'
import hexToRgba from 'hex-to-rgba'
import { Modal } from './Modal'
import { StoreContext } from './KeyValueStore'
import { KeywordsContext } from './KeywordsContext'
import { ApiContext } from './API/ApiContext'
import { Loading } from './API/Loading'
import { callApi } from './API'
import animateScrollTo from 'animated-scroll-to'

interface PassageProps {
  passage: any
  canGoBack: boolean
  historyGoBackListener: (listener: () => void) => () => void
  goBack: () => void
  changePassage: (name: string) => void
  hasHeader?: boolean
}

const ChatContainer = styled.div<{ hasHeader?: boolean }>`
  display: flex;
  height: ${({ hasHeader }) => (hasHeader ? 'calc(100% - 80px)' : '100%')};
  overflow: scroll;
  flex-direction: column;
  justify-content: space-between;
  transition: height 300ms;
  -webkit-overflow-scrolling: touch;

  & > * {
    box-sizing: content-box;
  }

  @media (max-width: 375px) {
    height: ${({ hasHeader }) => (hasHeader ? 'calc(100% - 64px)' : '100%')};
  }
`

const ChatPadding = styled.div`
  padding: 10vh 18vw;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;

  @media all and (max-width: 1300px) {
    padding: 10vh 5vw;
  }

  @media all and (max-width: 700px) {
    padding: 20px;
  }

  @media (max-width: 375px) {
    padding: 10px;
  }
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
  position: relative;
`

const HelpButtonWrapper = styled.div`
  display: none;
  justify-content: center;
  margin-top: 20px;
  @media (max-width: 768px) {
    display: flex;
  }
`

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
`

const HelpModalTitle = styled.h1`
  font-family: ${fonts.FAVORIT};
  font-size: 40px;
  line-height: 56px;
  color: ${colorsV2.black};
  margin-top: 36px;
  margin-bottom: 18px;
`

const HelpModalText = styled.p`
  font-family: ${fonts.FAVORIT};
  font-size: 16px;
  line-height: 24px;
  color: ${colorsV2.darkgray};
  margin-bottom: 10px;
`

const HelpModalSubtitle = styled(HelpModalText)`
  color: ${colorsV2.black};
`

const messageListMotionVariants = {
  reverse: {
    opacity: 1,
    transition: {
      delay: 0.15,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.15,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
}

export const Passage = (props: PassageProps) => {
  const [isResponding, setIsResponding] = React.useState(false)
  const [messagesAnimationState, setMessagesAnimationState] = React.useState(
    'visible',
  )
  const [isShowingHelp, setIsShowingHelp] = React.useState(false)
  const { tooltipModalInformationLabel } = React.useContext(KeywordsContext)
  const { track } = React.useContext(ApiContext)
  const api = React.useContext(ApiContext)
  const { store, setValue } = React.useContext(StoreContext)
  const [loading, setLoading] = React.useState(false)
  const [isActionsTransitioning, setIsActionsTransitioning] = React.useState(
    true,
  )

  const shouldShowActions = !(
    isResponding ||
    messagesAnimationState == 'reverse' ||
    loading
  )

  const goBack = () => {
    setMessagesAnimationState('reverse')
    track(`Passage Go Back - ${props.passage.name}`, {})
    setTimeout(() => {
      props.goBack()
      setMessagesAnimationState('visible')
    }, 400)
  }

  React.useEffect(() => {
    console.log(`Rendering passage ${props.passage.name}`, props.passage)

    if (props.passage.api) {
      setLoading(true)

      callApi(props.passage.api, api, store, setValue, (name) => {
        setTimeout(() => {
          setLoading(false)
          setMessagesAnimationState('visible')
        }, 650)

        setTimeout(() => {
          props.changePassage(name)
        }, 1800)
      })
    }

    const passageTracks = props.passage.tracks

    if (passageTracks) {
      passageTracks.forEach((passageTracking: any) => {
        const customData = passageTracking.customData
          ? JSON.parse(passageTracking.customData)
          : {}

        if (passageTracking.includeAllKeys) {
          track(passageTracking.eventName, {
            ...store,
            passage: props.passage.name,
            ...customData,
          })

          return
        }

        track(
          passageTracking.eventName,
          passageTracking.eventKeys.reduce(
            (acc: { [key: string]: any }, curr: string) => {
              return { ...acc, [curr]: store[curr] }
            },
            {
              passage: props.passage.name,
              ...customData,
            },
          ),
        )
      })
    }
  }, [props.passage])

  React.useEffect(() => {
    return props.historyGoBackListener(() => {
      goBack()
    })
  })

  return (
    <ChatContainer hasHeader={props.hasHeader}>
      <ChatPadding>
        <motion.div
          initial="visible"
          animate={messagesAnimationState}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
            },
            reverse: {
              opacity: 0,
              y: 200,
            },
            forwards: {
              opacity: 0,
              y: -200,
            },
          }}
          transition={{
            type: 'spring',
            stiffness: 220,
            damping: 120,
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
            <AnimatePresence>
              {loading && (
                <MessageAnimation>
                  <Loading />
                </MessageAnimation>
              )}
            </AnimatePresence>
            {!loading &&
              props.passage.messages.map((message: any) => (
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
          animate={shouldShowActions ? 'visible' : 'hidden'}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
            },
            hidden: {
              opacity: -0.05,
              y: 150,
            },
          }}
          onAnimationStart={() => {
            setIsActionsTransitioning(true)
          }}
          onAnimationComplete={() => {
            setIsActionsTransitioning(false)
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 100,
            delay: shouldShowActions ? 0.75 : 0,
          }}
        >
          <BottomContent>
            {props.canGoBack && (
              <BackButton
                onClick={() => {
                  goBack()
                }}
              />
            )}
            <Actions>
              <Action
                isTransitioning={isActionsTransitioning}
                key={props.passage.name}
                passageName={props.passage.name}
                action={props.passage.action}
                changePassage={(name) => {
                  setIsResponding(true)

                  setTimeout(() => {
                    setMessagesAnimationState('forwards')
                  }, 650)

                  setTimeout(() => {
                    setMessagesAnimationState('visible')
                    setIsResponding(false)
                    props.changePassage(name)
                    animateScrollTo(0)
                  }, 1000)
                }}
              />
            </Actions>
            {props.passage.tooltips.length !== 0 && (
              <HelpButtonWrapper>
                <HelpButton
                  onClick={() => {
                    setIsShowingHelp(true)
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
          <HelpModalTitle>{tooltipModalInformationLabel}</HelpModalTitle>
          {props.passage.tooltips.map((tooltip: any) => (
            <>
              <HelpModalSubtitle>{tooltip.title}</HelpModalSubtitle>
              <HelpModalText>{tooltip.description}</HelpModalText>
            </>
          ))}
        </Modal>
      )}
    </ChatContainer>
  )
}
