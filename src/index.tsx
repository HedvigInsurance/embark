import React from 'react'
import * as ReactDOM from 'react-dom'
import { Editor } from './Editor'
import { Global, css } from '@emotion/core'
import { getCdnFontFaces, colorsV3 } from '@hedviginsurance/brand'

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

const Root = () => {
  return (
    <>
      <Global
        styles={css`
          * {
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: FavoritStd, sans-serif;
          }

          #root {
            height: 100%;
          }

          a,
          a:hover,
          a:visited,
          a:active {
            color: inherit;
            text-decoration: none;
            border-bottom: 2px solid transparent;
          }

          a:hover {
            border-bottom: 2px solid #fff;
          }

          ul,
          li {
            list-style-type: none;
          }

          html {
            background-color: ${colorsV3.black};
          }
          ${getCdnFontFaces()}
        `}
      />
      <Editor />
    </>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'))
