import styled from '@emotion/styled'
import { colorsV3, fonts } from '@hedviginsurance/brand'

const ComboboxField = styled.div`
  box-sizing: border-box;
  text-align: left;
  width: 100%;
  position: relative;

  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${colorsV3.gray500};

  &:focus-within {
    border-color: ${colorsV3.purple500};
    box-shadow: 0 0 0 2px ${colorsV3.purple300};
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 16px;
  top: calc(50% - 9px);
  cursor: pointer;
  height: 18px;
  width: 18px;
  border: 0;
  border-radius: 9px;
  background-color: ${colorsV3.gray500};
  outline: 0;
  padding: 0;

  &:hover {
    background-color: ${colorsV3.gray700};
  }

  &:focus {
    box-shadow: 0 0 0 3px ${colorsV3.purple300};
  }

  svg {
    width: 60%;
    height: 60%;
  }
`

const ComboboxList = styled.ul`
  padding: 0;
  margin: 0;
  width: 100%;

  flex: 1;
  overflow: auto;
`

const ComboboxInput = styled.input`
  width: 100%;

  background: none;
  border: none;
  box-sizing: border-box;
  text-align: left;
  appearance: none;
  -moz-appearance: textfield;
  outline: 0;

  font-family: ${fonts.FAVORIT};
  font-size: 20px;
  color: ${colorsV3.black};

  &::placeholder {
    color: ${colorsV3.gray300};
  }
`

const ComboboxOption = styled.li`
  padding: 8px 16px;
  min-height: 32px;
  display: flex;
  align-items: center;

  text-align: left;
  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 16px;
  color: ${colorsV3.gray900};
  cursor: pointer;

  &:not(:first-of-type) {
    border-top: 1px solid ${colorsV3.gray300};
  }

  &[data-highlighted] {
    background-color: ${colorsV3.purple300};
    border-top-color: ${colorsV3.purple300};
  }

  &[data-highlighted] + & {
    border-top-color: ${colorsV3.purple300};
  }

  &:active {
    background-color: ${colorsV3.purple500};
    border-top-color: ${colorsV3.purple500};
  }

  &:active + & {
    border-top-color: ${colorsV3.purple500};
  }
`

const ComboboxOptionNotFound = styled(ComboboxOption)`
  color: ${colorsV3.red500};

  &[data-highlighted] {
    background-color: ${colorsV3.red500};
    border-top-color: ${colorsV3.red500};
    color: ${colorsV3.white};
  }
`

export default {
  Field: ComboboxField,
  Input: ComboboxInput,
  ClearButton,
  List: ComboboxList,
  Option: ComboboxOption,
  OptionNotFound: ComboboxOptionNotFound,
}
