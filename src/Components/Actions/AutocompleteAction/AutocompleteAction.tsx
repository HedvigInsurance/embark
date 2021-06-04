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
import { useCombobox } from 'downshift'
import { AddressAutocompleteData } from '../../API/addressAutocomplete'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import useDebounce from './useDebounce'
import { ContinueButton } from '../../ContinueButton'

const StyledCombobox = styled.div`
  text-align: left;
`

const StyledComboboxList = styled.ul`
  padding: 0;
  margin: 0;
`

const BottomSpacedInput = styled(Input)`
  text-align: left;
  margin-bottom: 1rem;

  @media (min-width: 600px) {
    margin-left: 2rem;
    margin-right: 2rem;
    margin-bottom: 1.5rem;
  }
`

const StyledComboboxOption = styled.li`
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;

  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 1rem;
  color: ${colorsV3.gray900};
  border-top: 1px solid ${colorsV3.gray300};
  cursor: pointer;

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

const useAddressSearch = (
  searchTerm: string = '',
): [
  AddressAutocompleteData[] | null,
  React.Dispatch<React.SetStateAction<AddressAutocompleteData[] | null>>,
] => {
  const api = React.useContext(ApiContext)
  const [options, setOptions] = React.useState<
    AddressAutocompleteData[] | null
  >(null)

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
      setOptions(null)
    }
  }, [searchTerm])

  return [options, setOptions]
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
  const [
    pickedOption,
    setPickedOption,
  ] = React.useState<AddressAutocompleteData | null>(null)

  const debouncedTextValue = useDebounce(textValue, 300)
  const [options, setOptions] = useAddressSearch(debouncedTextValue)

  const {
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox<AddressAutocompleteData>({
    selectedItem: pickedOption,
    inputValue: textValue,
    items: options || [],
    itemToString: (item) => (item ? formatAddressLine(item) : ''),
    onInputValueChange: ({ inputValue }) => {
      setTextValue(inputValue || '')
      if (!inputValue) {
        setPickedOption(null)
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem && !selectedItem.city) {
        // make sure to query for street by adding a space at the end of the query
        setTextValue(`${selectedItem.address} `)
      }

      // reset list of options
      setOptions(null)
      setPickedOption(selectedItem ?? null)
    },
  })

  const [confirmedOption, setConfirmedOption] = React.useState<
    AddressAutocompleteData | undefined
  >()
  React.useEffect(() => {
    const checkPickedOption = async (option: AddressAutocompleteData) => {
      const newOptions = await api.addressAutocompleteQuery(option.address)
      const oneResultLeft = newOptions.length === 1
      const sameResultsAsBefore = newOptions.every(
        (newOption, index) => newOption.id === options?.[index]?.id,
      )
      if (oneResultLeft || sameResultsAsBefore) {
        setConfirmedOption(option)
      }
    }

    if (pickedOption && pickedOption.id) {
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

        <StyledCombobox {...getComboboxProps()}>
          <BottomSpacedInput
            ref={inputRef}
            size={Math.max(
              props.placeholder.length,
              Math.min(
                pickedOption ? formatAddressLine(pickedOption).length : 0,
                23,
              ),
            )}
            placeholder={props.placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              animateScrollTo(0)
            }}
            {...getInputProps()}
          />
          {pickedOption && formatPostalLine(pickedOption) ? (
            <PostalAddress>{formatPostalLine(pickedOption)}</PostalAddress>
          ) : null}
        </StyledCombobox>
        <StyledComboboxList {...getMenuProps()}>
          {!confirmedOption
            ? options?.map((item, index) => (
                <StyledComboboxOption
                  key={`${item.address}${index}`}
                  {...(highlightedIndex === index && {
                    'data-highlighted': true,
                  })}
                  {...getItemProps({ item, index })}
                >
                  <div>
                    {formatAddressLine(item)}
                    {formatPostalLine(item) ? (
                      <PostalAddress>{formatPostalLine(item)}</PostalAddress>
                    ) : null}
                  </div>
                </StyledComboboxOption>
              ))
            : null}
        </StyledComboboxList>
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
