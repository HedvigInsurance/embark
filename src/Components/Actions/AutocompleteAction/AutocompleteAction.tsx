import * as React from 'react'
import { motion } from 'framer-motion'
import { StoreContext } from '../../KeyValueStore'
import { Tooltip } from '../../Tooltip'
import { Card, Input, Spacer } from '../Common'
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

const ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND'

const StyledContainer = styled.div`
  width: 100vw;
  max-width: 800px;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  @media (min-width: 768px) {
    width: auto;
  }
`

const StyledCard = styled(Card)`
  width: 100%;
  align-items: stretch;
  overflow: visible;
`

const StyledCombobox = styled.div`
  text-align: left;
`

const StyledComboboxList = styled.ul`
  padding: 0;
  margin: 0;
  width: 100%;

  margin-top: 0.5rem;
  background-color: ${colorsV3.white};
  border-radius: 8px;
`

const BottomSpacedInput = styled(Input)`
  width: 100%;
  text-align: left;
  margin: 0;
  line-height: 1;

  padding: 0.9rem 1rem 1rem;

  @media (min-width: 600px) {
    padding: 1.25rem 2rem 1.5rem;
  }
`

const StyledComboboxOption = styled.li`
  padding: 0.5rem 1rem;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  text-align: left;
  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 1rem;
  color: ${colorsV3.gray900};
  cursor: pointer;

  &:not(:first-child) {
    border-top: 1px solid ${colorsV3.gray300};
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
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

  @media (min-width: 600px) {
    font-size: 1.5rem;
    padding: 0.5rem 2rem;
  }
`

const NotFoundComboboxOption = styled(StyledComboboxOption)`
  color: ${colorsV3.red500};
`

const PostalAddress = styled.p`
  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 1rem;
  text-align: left;
  margin: 0;

  color: ${colorsV3.gray700};

  @media (min-width: 600px) {
    font-size: 1.25rem;
  }

  ${StyledComboboxOption} & {
    margin-top: 0.25rem;
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

const isMatchingStreetName = (
  searchTerm: string,
  option?: AddressAutocompleteData,
) => {
  return option?.streetName && searchTerm.startsWith(option.streetName)
}

const useAddressSearch = (
  searchTerm: string = '',
  option?: AddressAutocompleteData,
): [
  AddressAutocompleteData[] | null,
  React.Dispatch<React.SetStateAction<AddressAutocompleteData[] | null>>,
] => {
  const api = React.useContext(ApiContext)
  const [options, setOptions] = React.useState<
    AddressAutocompleteData[] | null
  >(null)

  const apiSearchTerm = React.useMemo(() => {
    if (option && !option.city) {
      // make sure to query for street by adding a space at the end of the query
      return searchTerm + ' '
    }

    if (
      option?.postalCode &&
      option?.city &&
      isMatchingStreetName(searchTerm, option)
    ) {
      // Make sure to search for specific address (floor, apartment)
      return `${searchTerm} ${option.postalCode} ${option.city}`
    }

    return searchTerm
  }, [searchTerm, option])

  // @ts-ignore: clean-up function only needed conditionally
  React.useEffect(() => {
    if (apiSearchTerm.trim() !== '') {
      let isFresh = true
      api.addressAutocompleteQuery(apiSearchTerm).then((newOptions) => {
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
  }, [apiSearchTerm])

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
  const [
    confirmedOption,
    setConfirmedOption,
  ] = React.useState<AddressAutocompleteData | null>(null)

  const debouncedTextValue = useDebounce(textValue, 300)
  const [options, setOptions] = useAddressSearch(
    debouncedTextValue,
    pickedOption ?? undefined,
  )

  const [hasUpdatedOptions, setHasUpdatedOptions] = React.useState(false)
  const showAddressNotFound = useDebounce(hasUpdatedOptions, 3000)

  React.useEffect(() => {
    setHasUpdatedOptions(options !== null ? true : false)
    return () => setHasUpdatedOptions(false)
  }, [options])

  const comboboxItems = React.useMemo<AddressAutocompleteData[]>(() => {
    if (options && showAddressNotFound) {
      return [...options, { address: ADDRESS_NOT_FOUND }]
    }

    return options || []
  }, [options, showAddressNotFound])

  const {
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox<AddressAutocompleteData>({
    selectedItem: pickedOption,
    inputValue: textValue,
    items: comboboxItems,
    itemToString: (item) => (item ? formatAddressLine(item) : ''),
    onInputValueChange: ({ inputValue }) => {
      setTextValue(inputValue || '')
      setConfirmedOption(null)

      if (!inputValue) {
        // reset picked option for empty input field
        setPickedOption(null)
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      // reset list of options
      setOptions(null)
      setPickedOption(selectedItem ?? null)
    },
  })

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
      setConfirmedOption(null)
    }

    return () => setConfirmedOption(null)
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

  const postalLine = React.useMemo(() => {
    if (pickedOption && isMatchingStreetName(textValue, pickedOption)) {
      return formatPostalLine(pickedOption)
    } else return undefined
  }, [pickedOption, textValue])

  return (
    <StyledContainer>
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
            {...getInputProps({
              ref: inputRef,
              placeholder: props.placeholder,
              onFocus: () => setIsFocused(true),
              onBlur: () => {
                setIsFocused(false)
                animateScrollTo(0)
              },
              size: Math.max(
                props.placeholder.length,
                Math.min(textValue.length, 23),
              ),
            })}
          />
          {postalLine ? <PostalAddress>{postalLine}</PostalAddress> : null}
        </StyledCombobox>
      </StyledCard>

      <StyledComboboxList {...getMenuProps()}>
        {!confirmedOption && isFocused
          ? comboboxItems.map((item, index) => {
              const props = {
                key: `${item.address}${index}`,
                ...(highlightedIndex === index && {
                  'data-highlighted': true,
                }),
                ...getItemProps({ item, index }),
              }

              if (item.address === ADDRESS_NOT_FOUND) {
                return (
                  <NotFoundComboboxOption {...props}>
                    Can't find my address
                  </NotFoundComboboxOption>
                )
              }

              const postalLine = formatPostalLine(item)
              return (
                <StyledComboboxOption {...props}>
                  <div>
                    {formatAddressLine(item)}
                    {postalLine ? (
                      <PostalAddress>{postalLine}</PostalAddress>
                    ) : null}
                  </div>
                </StyledComboboxOption>
              )
            })
          : null}
      </StyledComboboxList>

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
    </StyledContainer>
  )
}
