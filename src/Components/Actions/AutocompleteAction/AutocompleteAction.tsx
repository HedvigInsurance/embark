import * as React from 'react'
import { motion } from 'framer-motion'
import { StoreContext, Store } from '../../KeyValueStore'
import { Tooltip } from '../../Tooltip'
import { Card, Input, Spacer } from '../Common'
import styled from '@emotion/styled'
import { ApiContext } from '../../API/ApiContext'
import { ApiComponent } from '../../API/apiComponent'
import { useCombobox } from 'downshift'
import { AddressAutocompleteData } from '../../API/addressAutocomplete'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import useDebounce from './useDebounce'
import { ContinueButton } from '../../ContinueButton'

type CompleteAddressAutocompleteData = {
  [P in keyof AddressAutocompleteData]-?: AddressAutocompleteData[P]
}

const isCompleteAutocomplete = (
  data: AddressAutocompleteData,
): data is CompleteAddressAutocompleteData => {
  return Object.values(data).every((value) => value !== undefined)
}

const ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND'

const STORE_KEY = {
  ID: 'bbrId',
  ADDRESS: 'fullAddress',
  STREET: 'street',
  STREET_NAME: 'streetName',
  STREET_NUMBER: 'streetNumber',
  ZIP_CODE: 'zipCode',
  CITY: 'city',
  FLOOR: 'floor',
  APARTMENT: 'apartment',
  OPTION: 'addressOption',
}

const StyledChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const StyledCard = styled(Card)`
  width: 100%;

  padding-bottom: 24px;

  @media (max-width: 600px) {
    padding-bottom: 16px;
  }
`

const StyledFakeInput = styled(Input)`
  width: 100%;
  text-align: left;
  margin-left: 0;
  margin-right: 0;
  padding: 0 16px;
`

const StyledContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: ${colorsV3.white};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const StyledHeader = styled.header`
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;
`

const StyledHeaderRow = styled.div<{ align: 'center' | 'flex-start' }>`
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: ${(props) => props.align};
  justify-content: flex-end;
  position: relative;
`

const StyledHeaderLabel = styled.label`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;

  color: ${colorsV3.black};
  font-family: ${fonts.FAVORIT};
  text-align: center;
  font-size: 16px;
`

const StyledHeaderButton = styled.button`
  border: 0;
  background: transparent;
  appearance: none;
  position: relative;
  z-index: 2;

  color: ${colorsV3.black};
  font-family: ${fonts.FAVORIT};
  font-size: 16px;
`

const StyledCombobox = styled.div`
  box-sizing: border-box;
  text-align: left;
  width: 100%;

  border: 1px solid ${colorsV3.gray500};
  border-radius: 8px;

  padding: 8px 16px;

  @media (min-width: 600px) {
    padding: 1.25rem 2rem 1.5rem;
  }
`

const StyledComboboxList = styled.ul`
  padding: 0;
  margin: 0;
  width: 100%;

  flex: 1;
  overflow: auto;
`

const BottomSpacedInput = styled(Input)`
  width: 100%;
  text-align: left;
  margin: 0;
  line-height: 1;

  @media (min-width: 600px) {
    font-size: 32px;

    ::placeholder {
      font-size: 32px;
    }
  }
`

const StyledComboboxOption = styled.li`
  padding: 0.5rem 1rem;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  text-align: left;
  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 1rem;
  color: ${colorsV3.gray900};
  cursor: pointer;

  border-top: 1px solid ${colorsV3.gray300};

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

  ${StyledFakeInput} + & {
    padding-left: 16px;
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

const getAddressFromStore = (
  store: Store,
): CompleteAddressAutocompleteData | null => {
  const data: AddressAutocompleteData = {
    id: store[STORE_KEY.ID],
    address: store[STORE_KEY.ADDRESS],
    streetName: store[STORE_KEY.STREET_NAME],
    streetNumber: store[STORE_KEY.STREET_NUMBER],
    floor: store[STORE_KEY.FLOOR],
    apartment: store[STORE_KEY.APARTMENT],
    postalCode: store[STORE_KEY.ZIP_CODE],
    city: store[STORE_KEY.CITY],
  }

  return isCompleteAutocomplete(data) ? data : null
}

export const AutocompleteAction: React.FunctionComponent<AutocompleteActionProps> = (
  props,
) => {
  const api = React.useContext(ApiContext)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { store, setValue } = React.useContext(StoreContext)

  const [textValue, setTextValue] = React.useState(store[props.storeKey] || '')
  const [
    pickedOption,
    setPickedOption,
  ] = React.useState<AddressAutocompleteData | null>(() =>
    getAddressFromStore(store),
  )
  const [
    confirmedOption,
    setConfirmedOption,
  ] = React.useState<CompleteAddressAutocompleteData | null>(null)

  const debouncedTextValue = useDebounce(textValue, 300)
  const [options] = useAddressSearch(
    debouncedTextValue,
    pickedOption ?? undefined,
  )

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (confirmedOption) {
      setIsModalOpen(false)
      inputRef.current?.blur()
    }
  }, [confirmedOption])

  const comboboxItems = React.useMemo<AddressAutocompleteData[]>(() => {
    if (options) {
      return [...options, { address: ADDRESS_NOT_FOUND }]
    }

    return options || []
  }, [options])

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
      inputRef.current?.focus()
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
      if (
        (oneResultLeft || sameResultsAsBefore) &&
        isCompleteAutocomplete(option)
      ) {
        setConfirmedOption(option)
      }
    }

    if (pickedOption && pickedOption.id) {
      if (isCompleteAutocomplete(pickedOption)) {
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
    (address: CompleteAddressAutocompleteData) => {
      setValue(STORE_KEY.ID, address.id)
      setValue(
        STORE_KEY.STREET,
        `${address.streetName} ${address.streetNumber}`,
      )
      setValue(STORE_KEY.FLOOR, address.floor)
      setValue(STORE_KEY.APARTMENT, address.apartment)
      setValue(STORE_KEY.ZIP_CODE, address.postalCode)
      setValue(STORE_KEY.CITY, address.city)

      setValue(STORE_KEY.ADDRESS, address.address)
      setValue(STORE_KEY.STREET_NAME, address.streetName)
      setValue(STORE_KEY.STREET_NUMBER, address.streetNumber)

      const addressLine = formatAddressLine(address)
      setValue(props.storeKey, addressLine)
      setValue(`${props.passageName}Result`, addressLine)

      return props.onContinue()
    },
    [],
  )

  const postalLine = React.useMemo(() => {
    if (pickedOption && isMatchingStreetName(textValue, pickedOption)) {
      return formatPostalLine(pickedOption)
    } else return undefined
  }, [pickedOption, textValue])

  const addressLine = React.useMemo(
    () => (pickedOption ? formatAddressLine(pickedOption) : null),
    [pickedOption],
  )

  React.useEffect(() => {
    if (isModalOpen) {
      // Move focus to input on next render
      setTimeout(() => inputRef.current?.focus(), 1)
    }
  }, [isModalOpen])

  return (
    <StyledChatContainer>
      <motion.div
        animate={{
          translateY: isModalOpen ? '-100%' : 0,
          opacity: isModalOpen ? 0 : 1,
        }}
        transition={{ ease: 'easeOut', duration: 0.25 }}
      >
        <StyledCard
          loading={loading}
          isFocused={isHovered}
          onSubmit={(event) => event.preventDefault()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {props.tooltip ? <Tooltip tooltip={props.tooltip} /> : null}

          <StyledFakeInput
            placeholder={props.placeholder}
            value={addressLine || ''}
            onClick={() => setIsModalOpen(true)}
          />
          {postalLine ? <PostalAddress>{postalLine}</PostalAddress> : null}
        </StyledCard>
      </motion.div>

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

      <StyledContainer
        animate={{
          opacity: isModalOpen ? 1 : 0,
          pointerEvents: isModalOpen ? 'initial' : 'none',
        }}
        transition={{ delay: 0.15, duration: 0.2 }}
      >
        <StyledHeader>
          <StyledHeaderRow align="center">
            <StyledHeaderLabel>Address</StyledHeaderLabel>
            <StyledHeaderButton onClick={() => setIsModalOpen(false)}>
              Cancel
            </StyledHeaderButton>
          </StyledHeaderRow>

          <StyledHeaderRow align="flex-start">
            <StyledCombobox {...getComboboxProps()}>
              <BottomSpacedInput
                {...getInputProps({
                  ref: inputRef,
                  placeholder: props.placeholder,
                })}
              />
              {postalLine ? <PostalAddress>{postalLine}</PostalAddress> : null}
            </StyledCombobox>
          </StyledHeaderRow>
        </StyledHeader>

        <StyledComboboxList {...getMenuProps()}>
          {!confirmedOption
            ? comboboxItems.map((item, index) => {
                const itemProps = {
                  key: `${item.address}${index}`,
                  ...(highlightedIndex === index && {
                    'data-highlighted': true,
                  }),
                  ...getItemProps({ item, index }),
                }

                if (item.address === ADDRESS_NOT_FOUND) {
                  return (
                    <NotFoundComboboxOption
                      {...itemProps}
                      onClick={() => {
                        setIsModalOpen(false)
                        setValue(props.storeKey, 'Unknown')
                        props.onContinue()
                      }}
                    >
                      Can't find my address
                    </NotFoundComboboxOption>
                  )
                }

                const postalLine = formatPostalLine(item)
                return (
                  <StyledComboboxOption {...itemProps}>
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
      </StyledContainer>
    </StyledChatContainer>
  )
}
