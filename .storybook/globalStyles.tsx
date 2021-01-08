import { css } from '@emotion/core'
import { colorsV3, fonts, getCdnFontFaces } from '@hedviginsurance/brand'

export const globalStylesStorybook = css`
  ${getCdnFontFaces()}

  * {
    box-sizing: border-box;
    font-family: ${fonts.FAVORIT}, sans-serif;
  }

  body {
    font-size: 16px;
    line-height: 1.25;
    margin: 0;
    padding: 0;
    color: ${colorsV3.gray900};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 400;
  }

  a {
    color: ${colorsV3.purple500};
    &:hover,
    &:focus {
      color: ${colorsV3.purple500};
    }
  }
`
