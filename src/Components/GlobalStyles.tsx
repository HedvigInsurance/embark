import * as React from "react";
import { Global, css } from "@emotion/core";
import { getCdnFontFaces, fonts } from "@hedviginsurance/brand";

export const GlobalStyles = () => (
  <Global
    styles={css`
      ${getCdnFontFaces()}
      * {
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-family: ${fonts.CIRCULAR}, sans-serif;
      }

      body {
        font-family: ${fonts.CIRCULAR}, sans-serif;
        font-size: 16px;
      }

      ul,
      li {
        list-style-type: none;
      }
    `}
  />
);
