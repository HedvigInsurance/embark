import * as React from 'react'
import { StoreContext } from '../../KeyValueStore'
import { Tooltip } from '../../Tooltip'
import { Card, Input, Container } from '../Common'
import styled from '@emotion/styled'
import { ApiContext } from '../../API/ApiContext'
import { ApiComponent } from '../../API/apiComponent'
import animateScrollTo from 'animated-scroll-to'
import { useAutoFocus } from '../../../Utils/useAutoFocus'
import debounce from 'lodash.debounce'

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxButton,
  ComboboxOptionText,
} from '@reach/combobox'
import '@reach/combobox/styles.css'
import { AddressAutocompleteData } from '../../API/addressAutocomplete'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { ArrowRight } from '../../Icons/ArrowRight'

const BottomSpacedInput = styled(Input)`
  text-align: left;
  margin-bottom: 1rem;

  @media (min-width: 600px) {
    margin-left: 2rem;
    margin-right: 2rem;
    margin-bottom: 1.5rem;
  }
`.withComponent(ComboboxInput)

const StyledCard = styled(Card)`
  align-items: stretch;
`

const StyledComboboxPopover = styled(ComboboxPopover)`
  border: 0;

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`

const StyledComboboxOption = styled(ComboboxOption)`
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;

  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 1rem;
  color: ${colorsV3.gray900};
  border-top: 1px solid ${colorsV3.gray300};

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &[data-highlighted] {
    background-color: ${colorsV3.purple500};
    border-top-color: ${colorsV3.purple500};

    &:hover {
      background-color: ${colorsV3.purple300};
      border-top-color: ${colorsV3.purple300};
    }
  }

  &[data-highlighted] + & {
    border-top-color: ${colorsV3.purple500};
  }

  &:hover {
    background-color: ${colorsV3.purple300};
    border-top-color: ${colorsV3.purple300};
  }

  &:hover + & {
    border-top-color: ${colorsV3.purple300};
  }

  @media (min-width: 600px) {
    padding: 0 2rem;
  }
`

export interface AutocompleteActionProps {
  isTransitioning: boolean
  passageName: string
  storeKey: string
  link: any
  placeholder: string
  tooltip?: {
    title: string
    description: string
  }
  api?: ApiComponent
  onContinue: () => void
}

const formatAddressLine = (address: AddressAutocompleteData): string => {
  if (address.streetName && address.streetNumber) {
    let displayAddress = `${address.streetName} ${address.streetNumber}`
    if (address.floor) displayAddress += `, ${address.floor}.`
    if (address.apartment) displayAddress += ` ${address.apartment}`
    return displayAddress
  }

  return address.address
}

const useAddressSearch = (searchTerm: string) => {
  const api = React.useContext(ApiContext)
  const [options, setOptions] = React.useState<AddressAutocompleteData[]>([])

  // @ts-ignore: clean-up function only needed conditionally
  React.useEffect(() => {
    if (searchTerm.trim() !== '') {
      let isFresh = true
      api.addressAutocompleteQuery(searchTerm).then((newOptions) => {
        if (isFresh) setOptions(newOptions)
      })
      return () => {
        isFresh = false
      }
    } else {
      setOptions([])
    }
  }, [searchTerm])

  return options
}

export const AutocompleteAction: React.FunctionComponent<AutocompleteActionProps> = (
  props,
) => {
  const api = React.useContext(ApiContext)
  const [isFocused, setIsFocused] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { store, setValue } = React.useContext(StoreContext)
  const [textValue, setTextValue] = React.useState(store[props.storeKey] || '')

  const debounceTextValue = React.useCallback(
    debounce((value: string) => {
      setTextValue(value)
    }, 300),
    [],
  )

  const options = useAddressSearch(textValue)

  const handleSelect = React.useCallback(
    async (address: string) => {
      const selectedOption = options.find((item) => item.address === address)
      if (selectedOption && selectedOption.id) {
        const newOptions = await api.addressAutocompleteQuery(address)
        const oneResultLeft = newOptions.length === 1
        const sameResultsAsBefore = newOptions.every(
          (newOption, index) => newOption.id === options[index]?.id,
        )
        if (oneResultLeft || sameResultsAsBefore) {
          setValue(props.storeKey, selectedOption.address)
          setValue(`${props.passageName}Result`, selectedOption.address)
          return props.onContinue()
        }
      }

      setTextValue(address)
      setTimeout(() => {
        buttonRef.current?.click()
      }, 1)
    },
    [options],
  )

  const inputRef = useAutoFocus(!props.isTransitioning)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <Container>
      <StyledCard
        loading={loading}
        isFocused={isFocused || isHovered}
        onSubmit={(event) => event.preventDefault()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {props.tooltip ? <Tooltip tooltip={props.tooltip} /> : null}

        <Combobox onSelect={handleSelect}>
          <ComboboxButton
            as="span"
            style={{ display: 'none' }}
            ref={buttonRef}
          />
          <BottomSpacedInput
            ref={inputRef}
            size={Math.max(
              props.placeholder.length,
              Math.min(textValue.length, 23),
            )}
            placeholder={props.placeholder}
            onFocus={() => setIsFocused(true)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              debounceTextValue(e.target.value)
            }
            onBlur={() => {
              setIsFocused(false)
              animateScrollTo(0)
            }}
            autocomplete={false}
          />
          <StyledComboboxPopover portal={false}>
            <ComboboxList>
              {options.map((item) => (
                <StyledComboboxOption
                  key={item.id || item.address}
                  value={item.address}
                >
                  <div>
                    <ComboboxOptionText />
                  </div>
                  <ArrowRight />
                </StyledComboboxOption>
              ))}
            </ComboboxList>
          </StyledComboboxPopover>
        </Combobox>
        <input type="submit" style={{ display: 'none' }} />
      </StyledCard>
    </Container>
  )
}
