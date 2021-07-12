import * as React from 'react'
import styled from '@emotion/styled'
import { colorsV3, fonts } from '@hedviginsurance/brand'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${colorsV3.gray900};
`

const Input = styled.input`
  margin-left: 16px;
  margin-right: 16px;
  font-size: 56px;
  line-height: 1;
  font-family: ${fonts.FAVORIT};
  background: none;
  border: none;
  box-sizing: border-box;
  text-align: center;
  max-width: 100%;
  margin-top: 16px;
  color: ${colorsV3.gray900};
  outline: 0;
  ::placeholder {
    color: ${colorsV3.gray500};
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  appearance: none;
  -moz-appearance: textfield;
`

const Unit = styled.p`
  margin: 8px auto 11px;
  text-align: center;
  color: ${colorsV3.gray900};
  font-family: ${fonts.FAVORIT};
`

type InlineNumberActionProps = {
  inputRef?: React.RefObject<HTMLInputElement>
  placeholder: string
  unit: string
  value: string
  onValue: (value: string) => void
}

export const InlineNumberAction = (props: InlineNumberActionProps) => (
  <Container>
    <Input
      type="number"
      pattern={`[0-9]*`}
      ref={props.inputRef}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(e) => {
        props.onValue(e.target.value)
      }}
    />
    <Unit>{props.unit}</Unit>
  </Container>
)
