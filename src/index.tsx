import React, { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { Passage } from './Components/Passage'
import { Proofing } from './Components/Proofing'
import { Global, css } from '@emotion/core'
import { getCdnFontFaces, colorsV3 } from '@hedviginsurance/brand'
import { createHashHistory } from 'history'

import { parseStoryData } from './Parsing/parseStoryData'
import { Header } from './Components/Header'
import { EmbarkProvider } from './Components/EmbarkProvider'
import { mockApiResolvers } from './Components/API/ApiContext'
import { useEmbark } from './Utils/useEmbark'

declare global {
  interface Window {
    requestIdleCallback: (
      callback: () => any,
      options: { timeout?: number },
    ) => void
  }
}

if (!window.requestIdleCallback) {
  window.requestIdleCallback = require('requestidlecallback').request
}

const isProofing = JSON.parse(
  document.getElementsByTagName('body')[0].getAttribute('isProofing') ||
    'false',
)
const data = parseStoryData(
  (window as any).STORY_DATA,
  (window as any).TEXT_KEY_MAP,
)

const getStartPassage = () => {
  const url = window.location.href
  const splitted = url.split('/')

  if (url.includes('play') || url.includes('test')) {
    const hasPassage = data.passages.filter(
      (passage: any) => passage.id == splitted[splitted.length - 1],
    )[0]
    return hasPassage ? splitted[splitted.length - 1] : data.startPassage
  }

  return data.startPassage
}

const history = createHashHistory({
  basename: `/stories/${data.id}/${
    window.location.href.includes('play') ? 'play' : 'test'
  }`,
  hashType: 'hashbang',
})

const Root = () => {
  const {
    reducer: [state, dispatch],
    goTo,
  } = useEmbark(() => ({
    data,
    history: [getStartPassage()],
    passageId: getStartPassage(),
  }))

  const passage = data.passages.find(
    (passage: any) => passage.id == state.passageId,
  )

  React.useEffect(() => {
    if (!history.location.pathname.includes(passage.id)) {
      history.push(`/${passage.id}`)
    }
  }, [passage])

  if (isProofing) {
    return (
      <>
        <Global
          styles={css`
            * {
              margin: 0;
              padding: 0;
            }

            ul,
            li {
              list-style-type: none;
            }

            html {
              background-color: ${colorsV3.gray900};
            }

            ${getCdnFontFaces()};
          `}
        />
        <Proofing name={data.name} passages={data.passages} />
      </>
    )
  }

  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null)

  useEffect(() => {
    setUrlParams(new URLSearchParams(window.location.search))
  }, [])

  return (
    <>
      <Global
        styles={css`
          * {
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          #root {
            height: 100%;
          }

          ul,
          li {
            list-style-type: none;
          }

          html {
            background-color: ${colorsV3.gray900};
          }
          ${getCdnFontFaces()}
        `}
      />
      <Header
        partnerName={urlParams && urlParams.get('partner')}
        passage={passage}
        storyData={data}
      />
      <Passage
        canGoBack={state.history.length > 1}
        historyGoBackListener={(onGoBack) =>
          history.listen((_, action) => {
            if (action == 'POP') {
              onGoBack()
            }
          })
        }
        passage={passage}
        goBack={() => {
          dispatch({
            type: 'GO_BACK',
          })
        }}
        changePassage={(name) => {
          goTo(name)
        }}
      />
    </>
  )
}

const RootContainer = () => (
  <EmbarkProvider
    data={data}
    resolvers={mockApiResolvers}
    externalRedirects={{
      Offer: () => {
        console.log('Should redirect to Offer!')
      },
      MailingList: () => {
        console.log('Should redirect to mailing list')
      },
    }}
    onStoreChange={(store) => {
      console.log('store changed', store)
    }}
  >
    <Root />
  </EmbarkProvider>
)

ReactDOM.render(<RootContainer />, document.getElementById('root'))
