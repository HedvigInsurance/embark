import * as React from 'react'
import styled from '@emotion/styled'
import { fonts, colorsV3 } from '@hedviginsurance/brand'
import hexToRgba from 'hex-to-rgba'
import { KeywordsContext } from '../KeywordsContext'

import { ArrowUp } from '../Icons/ArrowUp'

const Button = styled.button`
  -webkit-appearance: none;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  outline: 0;
  padding: 10px 20px;
  background-color: ${hexToRgba(colorsV3.white, 0.2)};
  font-family: ${fonts.FAVORIT};
  color: ${colorsV3.white};
  font-size: 14px;
  transition: all 250ms;

  .ArrowUpStroke {
    transition: all 250ms;
    stroke: ${colorsV3.white};
  }

  :hover {
    transform: translateY(1.5px);
    background-color: ${colorsV3.white};
    color: ${colorsV3.gray700};
    box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);

    .ArrowUpStroke {
      stroke: ${colorsV3.gray700};
    }
  }

  :active {
    transform: translateY(3px);
  }
`

const Spacer = styled.span`
  width: 5px;
  display: inline-block;
`

export type BackButtonProps = {
  onClick: () => void
}

export const BackButton = (props: BackButtonProps) => {
  const { backButton } = React.useContext(KeywordsContext)

  return (
    <Button onClick={props.onClick}>
      <ArrowUp />
      <Spacer />
      {backButton}
    </Button>
  )
}
