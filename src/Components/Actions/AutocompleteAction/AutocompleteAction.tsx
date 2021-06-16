import * as React from 'react'
import { motion } from 'framer-motion'
import { StoreContext, Store } from '../../KeyValueStore'
import { Tooltip } from '../../Tooltip'
import { Card, Input, Spacer } from '../Common'
import styled from '@emotion/styled'
import { ApiContext } from '../../API/ApiContext'
import { ApiComponent } from '../../API/apiComponent'
import { useCombobox } from 'downshift'
import {
  AddressAutocompleteData,
  CompleteAddressData,
  isCompleteAddressData,
} from '../../API/addressAutocomplete'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import useDebounce from './useDebounce'
import { ContinueButton } from '../../ContinueButton'
import Modal from './Modal'

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
  line-height: 1;
  font-size: 48px;

  @media (min-width: 600px) {
    margin-top: 20px;
    padding: 0 32px;
  }
`

const StyledOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: rgba(0, 0, 0, 0.6);

  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledContainer = styled(motion.div)`
  background: ${colorsV3.white};

  flex: 1;
  height: 100%;
  max-width: 600px;

  display: flex;
  flex-direction: column;

  @media (min-width: 600px) {
    border-radius: 8px;
    max-height: 600px;
  }
`

const StyledHeader = styled.header`
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;

  padding-bottom: 8px;
  border-bottom: 1px solid ${colorsV3.gray300};
`

const StyledHeaderRow = styled.div<{ align: 'center' | 'flex-start' }>`
  min-height: 56px;
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
`

const StyledComboboxList = styled.ul`
  padding: 0;
  margin: 0;
  width: 100%;

  flex: 1;
  overflow: auto;
`

const BottomSpacedInput = styled.input`
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

  @media (min-width: 600px) {
    font-size: 1.5rem;
    padding: 0.5rem 2rem;
  }
`

const NotFoundComboboxOption = styled(StyledComboboxOption)`
  color: ${colorsV3.red500};

  &[data-highlighted] {
    background-color: ${colorsV3.red500};
    border-top-color: ${colorsV3.red500};
    color: ${colorsV3.white};
  }
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

    @media (min-width: 600px) {
      padding-left: 32px;
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

const getAddressFromStore = (store: Store): CompleteAddressData | null => {
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

  return isCompleteAddressData(data) ? data : null
}

export const AutocompleteAction: React.FunctionComponent<AutocompleteActionProps> = (
  props,
) => {
  const api = React.useContext(ApiContext)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const { store, setValue, removeValues } = React.useContext(StoreContext)

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
  ] = React.useState<CompleteAddressData | null>(null)

  const debouncedTextValue = useDebounce(textValue, 300)
  const [options, setOptions] = useAddressSearch(
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

  const handleNoAddressFound = React.useCallback(() => {
    setIsModalOpen(false)

    Object.values(STORE_KEY).forEach((storeKey) => {
      removeValues(storeKey)
    })

    setValue(props.storeKey, 'Unknown')
    props.onContinue()
  }, [removeValues, setValue, props.storeKey])

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
    onInputValueChange: ({ inputValue, type }) => {
      if (type === '__input_keydown_escape__') return

      setTextValue(inputValue || '')
      setConfirmedOption(null)

      if (!inputValue) {
        // Reset picked option for empty input field
        setPickedOption(null)
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem?.address === ADDRESS_NOT_FOUND) {
        handleNoAddressFound()
      }

      // Reset list of options
      setOptions(null)
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
        isCompleteAddressData(option)
      ) {
        setConfirmedOption(option)
      }
    }

    if (pickedOption && pickedOption.id) {
      if (
        isCompleteAddressData(pickedOption) &&
        pickedOption.floor &&
        pickedOption.apartment
      ) {
        setConfirmedOption(pickedOption)
      } else {
        checkPickedOption(pickedOption)
      }
    } else {
      setConfirmedOption(null)
    }

    return () => setConfirmedOption(null)
  }, [pickedOption])

  const handleContinue = React.useCallback((address: CompleteAddressData) => {
    // Reset optional store values
    removeValues(STORE_KEY.APARTMENT)
    removeValues(STORE_KEY.FLOOR)

    setValue(STORE_KEY.ID, address.id)
    setValue(STORE_KEY.STREET, `${address.streetName} ${address.streetNumber}`)
    address.floor && setValue(STORE_KEY.FLOOR, address.floor)
    address.apartment && setValue(STORE_KEY.APARTMENT, address.apartment)
    setValue(STORE_KEY.ZIP_CODE, address.postalCode)
    setValue(STORE_KEY.CITY, address.city)

    setValue(STORE_KEY.ADDRESS, address.address)
    setValue(STORE_KEY.STREET_NAME, address.streetName)
    setValue(STORE_KEY.STREET_NUMBER, address.streetNumber)

    const addressLine = formatAddressLine(address)
    setValue(props.storeKey, addressLine)
    setValue(`${props.passageName}Result`, addressLine)

    return props.onContinue()
  }, [])

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
          opacity: isModalOpen ? 0 : 1,
        }}
        transition={{ ease: 'easeOut', duration: 0.25 }}
      >
        <StyledCard
          isFocused={isHovered}
          onSubmit={(event) => event.preventDefault()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {props.tooltip ? <Tooltip tooltip={props.tooltip} /> : null}

          <StyledFakeInput
            placeholder={props.placeholder}
            value={addressLine || textValue}
            onClick={() => setIsModalOpen(true)}
            onFocus={() => setIsModalOpen(true)}
            size={(addressLine || textValue).length}
          />
          {postalLine ? <PostalAddress>{postalLine}</PostalAddress> : null}
        </StyledCard>
      </motion.div>

      <Spacer />

      <ContinueButton
        onClick={() => handleContinue(confirmedOption!)}
        disabled={!confirmedOption}
        text={(props.link || {}).label || 'Nästa'}
      />

      <Modal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)}>
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
                    <NotFoundComboboxOption {...itemProps}>
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
      </Modal>
    </StyledChatContainer>
  )
}
