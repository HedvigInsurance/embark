import * as React from 'react'
import styled from '@emotion/styled'
import { Tooltip } from '../../Tooltip'
import { KeywordsContext } from '../../KeywordsContext'
import { colorsV3, fonts } from '@hedviginsurance/brand'

const Container = styled.button`
  display: inline-block;
  position: relative;
  text-align: center;
  background: ${colorsV3.white};
  padding: 22px;
  margin: 10px;
  -webkit-appearance: none;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  outline: 0;
  flex-grow: 1;
  flex-basis: 100%;
  transition: all 350ms;
  max-width: 225px;

  :hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
  }

  :active {
    transform: translateY(-1.5px);
  }

  @media all and (max-width: 1100px) {
    flex: 0 0 48%;
    margin: 1%;
    padding: 15px;
  }
`

const Label = styled.span`
  font-family: ${fonts.FAVORIT};
  font-size: 18px;

  @media all and (max-width: 800px) {
    font-size: 16px;
  }

  @media (max-width: 320px) {
    font-size: 14px;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

type SelectLabelProps = {
  isHovering: boolean
}

const SelectLabel = styled.span<SelectLabelProps>`
  display: inline-block;
  margin-top: 8px;
  font-family: ${fonts.FAVORIT};
  font-size: 14px;
  color: ${colorsV3.purple900};
  transition: all 350ms;

  @media all and (max-width: 800px) {
    font-size: 12px;
  }
`

export type SelectOptionProps = {
  label: String
  tooltip: {
    title: string
    description: string
  } | null
  onClick: () => void
}

export const SelectOption = (props: SelectOptionProps) => {
  const [isHovering, setIsHovering] = React.useState(false)
  const { selectActionSelectLabel } = React.useContext(KeywordsContext)

  return (
    <Container
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={props.onClick}
    >
      {props.tooltip && <Tooltip tooltip={props.tooltip} />}
      <Content>
        <Label>{props.label}</Label>
        <SelectLabel isHovering={isHovering}>
          {selectActionSelectLabel}
        </SelectLabel>
      </Content>
    </Container>
  )
}
