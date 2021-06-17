import * as React from 'react'
import { motion } from 'framer-motion'
import { StoreContext, Store } from '../../KeyValueStore'
import { Tooltip } from '../../Tooltip'
import { Card as BaseCard, Input, Spacer } from '../Common'
import styled from '@emotion/styled'
import { ApiContext } from '../../API/ApiContext'
import { ApiComponent } from '../../API/apiComponent'
import { useCombobox } from 'downshift'
import {
  AddressSuggestion,
  CompleteAddress,
  isCompleteAddress,
} from '../../API/addressAutocomplete'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import useDebounce from './useDebounce'
import { ContinueButton } from '../../ContinueButton'
import Modal from './Modal'
import useAddressSearch from './useAddressSearch'
import { isMatchingStreetName } from './utils'
import { Cross } from '../../Icons/Cross'

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
  ADDRESS_SEARCH_TERM: 'addressSearchTerm',
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const Card = styled(BaseCard)`
  width: 100%;

  padding-bottom: 24px;

  @media (max-width: 600px) {
    padding-bottom: 16px;
  }
`

const FakeInput = styled(Input)`
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

const ModalHeader = styled.header`
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;

  padding: 0 16px 16px;
  border-bottom: 1px solid ${colorsV3.gray300};
`

const ModalHeaderRow = styled.div<{ align: 'center' | 'flex-start' }>`
  height: 56px;
  display: flex;
  align-items: ${(props) => props.align};
  justify-content: flex-end;
`

const ModalHeaderLabel = styled.label`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;

  color: ${colorsV3.black};
  font-family: ${fonts.FAVORIT};
  text-align: center;
  font-size: 16px;
`

const ModalHeaderButton = styled.button`
  border: 0;
  background: transparent;
  appearance: none;
  outline: 0;
  position: relative;
  z-index: 2;

  color: ${colorsV3.black};
  font-family: ${fonts.FAVORIT};
  font-size: 16px;

  &:focus {
    border-radius: 4px;
    box-shadow: 0 0 0 3px ${colorsV3.purple300};
  }
`

const ComboboxField = styled.div<{ focus: boolean }>`
  box-sizing: border-box;
  text-align: left;
  width: 100%;
  position: relative;

  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid
    ${(props) => (props.focus ? colorsV3.purple300 : colorsV3.gray500)};
  ${(props) => props.focus && `box-shadow: 0 0 0 2px ${colorsV3.purple300}`}
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
  justify-content: space-between;

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

const PostalAddress = styled.p`
  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 16px;
  text-align: left;
  margin: 0;

  color: ${colorsV3.gray700};

  ${FakeInput} + & {
    padding-left: 16px;

    @media (min-width: 600px) {
      font-size: 24px;
      padding-left: 32px;
    }
  }
`

export interface AddressAutocompleteActionProps {
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

const formatAddressLine = (address: AddressSuggestion): string => {
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

const formatPostalLine = (address: AddressSuggestion): string | undefined => {
  if (address.city && address.postalCode) {
    return `${address.postalCode} ${address.city}`
  }

  return undefined
}

const getAddressFromStore = (store: Store): CompleteAddress | null => {
  const data: AddressSuggestion = {
    id: store[STORE_KEY.ID],
    address: store[STORE_KEY.ADDRESS],
    streetName: store[STORE_KEY.STREET_NAME],
    streetNumber: store[STORE_KEY.STREET_NUMBER],
    floor: store[STORE_KEY.FLOOR],
    apartment: store[STORE_KEY.APARTMENT],
    postalCode: store[STORE_KEY.ZIP_CODE],
    city: store[STORE_KEY.CITY],
  }

  return isCompleteAddress(data) ? data : null
}

export const AddressAutocompleteAction: React.FC<AddressAutocompleteActionProps> = (
  props,
) => {
  const api = React.useContext(ApiContext)
  const [isInputFocus, setIsInputFocus] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const { store, setValue, removeValues } = React.useContext(StoreContext)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const handleDismissModal = React.useCallback(() => setIsModalOpen(false), [])
  React.useEffect(() => {
    if (isModalOpen) {
      // Move focus to input on next render
      setTimeout(() => inputRef.current?.focus(), 1)
    }
  }, [isModalOpen])

  const [
    pickedSuggestion,
    setPickedSuggestion,
  ] = React.useState<AddressSuggestion | null>(() => getAddressFromStore(store))

  const [
    confirmedAddress,
    setConfirmedAddress,
  ] = React.useState<CompleteAddress | null>(null)

  const [textValue, setTextValue] = React.useState('')
  const debouncedTextValue = useDebounce(textValue, 300)
  const [suggestions, setSuggestions] = useAddressSearch(
    debouncedTextValue,
    pickedSuggestion ?? undefined,
  )

  React.useEffect(() => {
    if (confirmedAddress) {
      inputRef.current?.blur()
      setIsModalOpen(false)
    }
  }, [confirmedAddress])

  const handleClearInput = React.useCallback(() => {
    setTextValue('')
    setPickedSuggestion(null)
    inputRef.current?.focus()
  }, [])

  const clearStoreValues = React.useCallback(
    () =>
      Object.values(STORE_KEY).forEach((storeKey) => {
        removeValues(storeKey)
      }),
    [removeValues],
  )

  const handleContinue = React.useCallback(
    (address: CompleteAddress) => {
      clearStoreValues()

      setValue(STORE_KEY.ID, address.id)
      setValue(
        STORE_KEY.STREET,
        `${address.streetName} ${address.streetNumber}`,
      )
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
    },
    [
      clearStoreValues,
      setValue,
      props.storeKey,
      props.passageName,
      props.onContinue,
    ],
  )

  const handleNoAddressFound = React.useCallback(() => {
    setIsModalOpen(false)
    clearStoreValues()

    setValue(STORE_KEY.ADDRESS_SEARCH_TERM, textValue)
    setValue(props.storeKey, ADDRESS_NOT_FOUND)
    props.onContinue()
  }, [clearStoreValues, setValue, props.storeKey, textValue])

  const comboboxItems = React.useMemo<AddressSuggestion[]>(
    () => (suggestions ? [...suggestions, { address: ADDRESS_NOT_FOUND }] : []),
    [suggestions],
  )

  const {
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox<AddressSuggestion>({
    selectedItem: pickedSuggestion,
    inputValue: textValue,
    items: comboboxItems,
    itemToString: (item) => (item ? formatAddressLine(item) : ''),
    onInputValueChange: ({ inputValue, type }) => {
      if (type === '__input_keydown_escape__') return

      setTextValue(inputValue || '')
      setConfirmedAddress(null)

      if (!inputValue) {
        // Reset picked suggestion for empty input field
        setPickedSuggestion(null)
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem?.address === ADDRESS_NOT_FOUND) {
        handleNoAddressFound()
      }

      // Reset list of suggestions
      setSuggestions(null)
      inputRef.current?.focus()
      setPickedSuggestion(selectedItem ?? null)
    },
  })

  React.useEffect(() => {
    const checkPickedSuggestion = async (suggestion: AddressSuggestion) => {
      const newSuggestions = await api.addressAutocompleteQuery(
        suggestion.address,
      )
      const oneResultLeft = newSuggestions.length === 1
      const sameResultsAsBefore = newSuggestions.every(
        (newSuggestion, index) => newSuggestion.id === suggestions?.[index]?.id,
      )
      if (
        (oneResultLeft || sameResultsAsBefore) &&
        isCompleteAddress(suggestion)
      ) {
        setConfirmedAddress(suggestion)
      }
    }

    if (pickedSuggestion && pickedSuggestion.id) {
      if (
        isCompleteAddress(pickedSuggestion) &&
        pickedSuggestion.floor &&
        pickedSuggestion.apartment
      ) {
        setConfirmedAddress(pickedSuggestion)
      } else {
        checkPickedSuggestion(pickedSuggestion)
      }
    } else {
      setConfirmedAddress(null)
    }

    return () => setConfirmedAddress(null)
  }, [api, suggestions, pickedSuggestion])

  const postalLine = React.useMemo(() => {
    if (pickedSuggestion && isMatchingStreetName(textValue, pickedSuggestion)) {
      return formatPostalLine(pickedSuggestion)
    } else return undefined
  }, [pickedSuggestion, textValue])

  const addressLine = React.useMemo(
    () => (pickedSuggestion ? formatAddressLine(pickedSuggestion) : null),
    [pickedSuggestion],
  )

  return (
    <Container>
      <motion.div
        animate={{
          opacity: isModalOpen ? 0 : 1,
        }}
        transition={{ ease: 'easeOut', duration: 0.25 }}
      >
        <Card
          isFocused={isHovered}
          onSubmit={(event) => event.preventDefault()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {props.tooltip ? <Tooltip tooltip={props.tooltip} /> : null}

          <FakeInput
            placeholder={props.placeholder}
            value={addressLine || textValue}
            onClick={() => setIsModalOpen(true)}
            onFocus={() => setIsModalOpen(true)}
            size={(addressLine || textValue).length}
          />
          {postalLine ? <PostalAddress>{postalLine}</PostalAddress> : null}
        </Card>
      </motion.div>

      <Spacer />

      <ContinueButton
        onClick={() => handleContinue(confirmedAddress!)}
        disabled={!confirmedAddress}
        text={(props.link || {}).label || 'Nästa'}
      />

      <Modal isOpen={isModalOpen} onDismiss={handleDismissModal}>
        <ModalHeader>
          <ModalHeaderRow align="center">
            <ModalHeaderLabel>Address</ModalHeaderLabel>
            <ModalHeaderButton onClick={handleDismissModal}>
              Cancel
            </ModalHeaderButton>
          </ModalHeaderRow>

          <ComboboxField {...getComboboxProps()} focus={isInputFocus}>
            <ComboboxInput
              {...getInputProps({
                ref: inputRef,
                placeholder: props.placeholder,
                onFocus: () => setIsInputFocus(true),
                onBlur: () => setIsInputFocus(false),
              })}
            />
            {postalLine ? <PostalAddress>{postalLine}</PostalAddress> : null}

            {textValue ? (
              <ClearButton onClick={handleClearInput}>
                <Cross />
              </ClearButton>
            ) : null}
          </ComboboxField>
        </ModalHeader>

        <ComboboxList {...getMenuProps()}>
          {comboboxItems.map((item, index) => {
            const itemProps = {
              key: `${item.address}${index}`,
              ...(highlightedIndex === index && {
                'data-highlighted': true,
              }),
              ...getItemProps({ item, index }),
            }

            if (item.address === ADDRESS_NOT_FOUND) {
              return (
                <ComboboxOptionNotFound {...itemProps}>
                  Can't find my address
                </ComboboxOptionNotFound>
              )
            }

            const postalLine = formatPostalLine(item)
            return (
              <ComboboxOption {...itemProps}>
                <div>
                  {formatAddressLine(item)}
                  {postalLine ? (
                    <PostalAddress>{postalLine}</PostalAddress>
                  ) : null}
                </div>
              </ComboboxOption>
            )
          })}
        </ComboboxList>
      </Modal>
    </Container>
  )
}
