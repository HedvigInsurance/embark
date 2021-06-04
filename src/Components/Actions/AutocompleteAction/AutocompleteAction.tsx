import * as React from 'react'
import { motion } from 'framer-motion'
import { StoreContext } from '../../KeyValueStore'
import { Tooltip } from '../../Tooltip'
import { Card, Input, Container, Spacer } from '../Common'
import styled from '@emotion/styled'
import { ApiContext } from '../../API/ApiContext'
import { ApiComponent } from '../../API/apiComponent'
import animateScrollTo from 'animated-scroll-to'
import { useAutoFocus } from '../../../Utils/useAutoFocus'

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox'
import '@reach/combobox/styles.css'
import { AddressAutocompleteData } from '../../API/addressAutocomplete'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { ArrowRight } from '../../Icons/ArrowRight'
import useDebounce from './useDebounce'
import { ContinueButton } from '../../ContinueButton'

const StyledCombobox = styled(Combobox)`
  text-align: left;
`

const BottomSpacedInput = styled(Input)`
  text-align: left;
  margin-bottom: 1rem;

  @media (min-width: 600px) {
    margin-left: 2rem;
    margin-right: 2rem;
    margin-bottom: 1.5rem;
  }
`.withComponent(ComboboxInput)

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

const PostalAddress = styled.p`
  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 1rem;
  color: ${colorsV3.gray500};
  text-align: left;
  text-transform: uppercase;
  margin: 0;

  ${StyledComboboxOption} & {
    font-size: 0.75rem;
  }

  @media (min-width: 600px) {
    font-size: 1.25rem;
  }

  ${BottomSpacedInput} + & {
    margin-top: -1rem;
    padding: 1rem;
    padding-top: 0;

    @media (min-width: 600px) {
      margin-top: -2rem;
      padding: 0 2rem 1.5rem;
    }
  }
`

const StyledCard = styled(Card)`
  align-items: stretch;
  overflow: visible;
`

const StyledComboboxPopover = styled(ComboboxPopover)`
  border: 0;

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
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
    if (address.floor) {
      displayAddress += `, ${address.floor}.`
    }
    if (address.apartment) {
      displayAddress += ` ${address.apartment}`
    }
    return displayAddress
  }

  return address.address
}

const formatPostalLine = (
  address: AddressAutocompleteData,
): string | undefined => {
  if (address.city && address.postalCode) {
    return `${address.postalCode} ${address.city}`
  }

  return undefined
}

const useAddressSearch = (searchTerm: string = '') => {
  const api = React.useContext(ApiContext)
  const [options, setOptions] = React.useState<AddressAutocompleteData[]>([])

  // @ts-ignore: clean-up function only needed conditionally
  React.useEffect(() => {
    if (searchTerm.trim() !== '') {
      let isFresh = true
      api.addressAutocompleteQuery(searchTerm).then((newOptions) => {
        if (isFresh) {
          setOptions(newOptions)
        }
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

  const [pickedOption, setPickedOption] = React.useState<
    AddressAutocompleteData
  >({ address: store[props.storeKey] || '' })

  const debouncedOption = useDebounce(pickedOption, 300)
  const options = useAddressSearch(debouncedOption.address)

  const changeAddress = React.useCallback(
    (address: string) => {
      let selectedOption = options.find(
        (item) => formatAddressLine(item) === address,
      )

      if (selectedOption && !selectedOption.city) {
        // make sure to query for street by adding a space at the end of the query
        selectedOption = {
          ...selectedOption,
          address: `${selectedOption.address} `,
        }
      }

      setPickedOption(selectedOption || { address })
    },
    [options],
  )

  const formattedAddress = React.useMemo(
    () => formatAddressLine(pickedOption),
    [pickedOption],
  )
  const formattedPostalLine = React.useMemo(
    () => formatPostalLine(pickedOption),
    [pickedOption],
  )

  const [confirmedOption, setConfirmedOption] = React.useState<
    AddressAutocompleteData | undefined
  >()
  React.useEffect(() => {
    const checkPickedOption = async (option: AddressAutocompleteData) => {
      const newOptions = await api.addressAutocompleteQuery(option.address)
      const oneResultLeft = newOptions.length === 1
      const sameResultsAsBefore = newOptions.every(
        (newOption, index) => newOption.id === options[index]?.id,
      )
      if (oneResultLeft || sameResultsAsBefore) {
        setConfirmedOption(option)
      }
    }

    if (pickedOption.id) {
      if (pickedOption.floor && pickedOption.apartment) {
        setConfirmedOption(pickedOption)
      } else {
        checkPickedOption(pickedOption)
      }
    } else {
      setConfirmedOption(undefined)
    }

    return () => setConfirmedOption(undefined)
  }, [pickedOption])

  const handleContinue = React.useCallback(
    (option: AddressAutocompleteData) => {
      setValue(props.storeKey, option.address)
      setValue(`${props.passageName}Result`, option.address)
      return props.onContinue()
    },
    [],
  )

  const inputRef = useAutoFocus(!props.isTransitioning)

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

        <StyledCombobox onSelect={changeAddress}>
          <BottomSpacedInput
            ref={inputRef}
            size={Math.max(
              props.placeholder.length,
              Math.min(pickedOption.address.length, 23),
            )}
            placeholder={props.placeholder}
            onFocus={() => setIsFocused(true)}
            value={formattedAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              changeAddress(e.target.value)
            }
            onBlur={() => {
              setIsFocused(false)
              animateScrollTo(0)
            }}
            onKeyPress={(event) =>
              event.key === 'Enter' &&
              confirmedOption &&
              handleContinue(confirmedOption)
            }
            autocomplete={false}
          />
          {formattedPostalLine ? (
            <PostalAddress>{formattedPostalLine}</PostalAddress>
          ) : null}
          <StyledComboboxPopover portal={false}>
            {!confirmedOption ? (
              <ComboboxList>
                {options.map((item) => (
                  <StyledComboboxOption
                    key={item.address}
                    value={formatAddressLine(item)}
                  >
                    <div>
                      <ComboboxOptionText />
                      {formatPostalLine(item) ? (
                        <PostalAddress>{formatPostalLine(item)}</PostalAddress>
                      ) : null}
                    </div>
                    <ArrowRight />
                  </StyledComboboxOption>
                ))}
              </ComboboxList>
            ) : null}
          </StyledComboboxPopover>
        </StyledCombobox>
        <input type="submit" style={{ display: 'none' }} />
      </StyledCard>

      <Spacer />
      <motion.div
        animate={{
          opacity: loading ? 0 : 1,
        }}
        transition={{ ease: 'easeOut', duration: 0.25 }}
      >
        <motion.div
          animate={{
            height: loading ? 0 : 'auto',
            overflow: loading ? 'hidden' : 'inherit',
            opacity: loading ? 0 : 1,
          }}
          transition={{ delay: 0.25 }}
        >
          <ContinueButton
            onClick={() => handleContinue(confirmedOption!)}
            disabled={!confirmedOption}
            text={(props.link || {}).label || 'Nästa'}
          />
        </motion.div>
      </motion.div>
    </Container>
  )
}
