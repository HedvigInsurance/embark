import * as React from 'react'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import styled from '@emotion/styled'

const Button = styled.button`
  border-radius: 8px;
  padding: 16px 20px;
  background-color: ${colorsV3.gray200};
  -webkit-appearance: none;
  border: 0;
  cursor: pointer;
  font-family: ${fonts.FAVORIT};
  color: ${colorsV3.gray900};
  font-size: 15px;
  outline: 0;
  transition: all 250ms;

  :hover {
    box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
    transform: translateY(-3px);
  }

  :active {
    transform: translateY(-1.5px);
  }

  ${(props) =>
    props.disabled &&
    `
        background-color: ${colorsV3.gray800};
        color: ${colorsV3.gray700};

        :hover {
            box-shadow: none;
            transform: translateY(0);
        }
    `};
`

type ContinueButtonProps = {
  text: String
  disabled: boolean
  onClick: () => void
}

export const ContinueButton = (props: ContinueButtonProps) => (
  <Button disabled={props.disabled} onClick={props.onClick}>
    {props.text}
  </Button>
)
