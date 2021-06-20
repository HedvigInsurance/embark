import * as React from 'react'
import styled from '@emotion/styled'
import { useCombobox } from 'downshift'
import { AddressSuggestion } from '../../API/addressAutocomplete'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { Cross } from '../../Icons/Cross'
import Modal from './Modal'
import Combobox from './Combobox'
import useAddressSearch from './useAddressSearch'
import {
  formatAddressLine,
  formatAddressLines,
  formatPostalLine,
  isMatchingStreetName,
} from './utils'
import { KeywordsContext } from '../../KeywordsContext'

const ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND'

const ModalHeader = styled.header`
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;

  padding: 0 16px 16px;
  border-bottom: 1px solid ${colorsV3.gray300};
`

const ModalHeaderRow = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
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

const PostalAddress = styled.p`
  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 16px;
  text-align: left;
  margin: 0;
  color: ${colorsV3.gray700};
`

const AddressOption: React.FC<{ address: AddressSuggestion }> = ({
  address,
}) => {
  const [addressLine, postalLine] = formatAddressLines(address)
  return (
    <div>
      {addressLine}
      {postalLine ? <PostalAddress>{postalLine}</PostalAddress> : null}
    </div>
  )
}

interface Props {
  isActive: boolean
  onDismiss: () => void
  selected: AddressSuggestion | null
  onSelect: (suggestion: AddressSuggestion | null) => void
  onNotFound: () => void
  placeholder: string
  value: string
  onChange: (newValue: string) => void
}

const AddressAutocomplete: React.FC<Props> = (props) => {
  const {
    isActive,
    onDismiss,
    placeholder,
    selected,
    onSelect,
    onNotFound,
    value,
    onChange,
  } = props

  const keywords = React.useContext(KeywordsContext)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [suggestions, setSuggestions] = useAddressSearch(
    value,
    selected ?? undefined,
  )

  React.useEffect(() => {
    if (isActive) {
      // Move focus to input on next render
      setTimeout(() => inputRef.current?.focus(), 1)
    } else {
      inputRef.current?.blur()
    }
  }, [isActive])

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
    selectedItem: selected,
    inputValue: value,
    items: comboboxItems,
    itemToString: (item) => (item ? formatAddressLine(item) : ''),
    onInputValueChange: ({ inputValue, type }) => {
      if (type === '__input_keydown_escape__') return

      onChange(inputValue || '')

      if (!inputValue) {
        // Reset picked suggestion for empty input field
        onSelect(null)
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem?.address === ADDRESS_NOT_FOUND) {
        onNotFound()
      }

      // Reset list of suggestions
      setSuggestions(null)
      inputRef.current?.focus()
      onSelect(selectedItem ?? null)
    },
  })

  const handleClearInput = React.useCallback(() => {
    onChange('')
    onSelect(null)
    inputRef.current?.focus()
  }, [])

  const pickedPostalLine = selected ? formatPostalLine(selected) : undefined
  const isMatchingPickedSuggestion = isMatchingStreetName(
    value,
    selected ?? undefined,
  )

  return (
    <Modal isOpen={isActive} onDismiss={onDismiss}>
      <ModalHeader>
        <ModalHeaderRow>
          <ModalHeaderLabel>
            {keywords.addressAutoCompleteModalTitle}
          </ModalHeaderLabel>
          <ModalHeaderButton onClick={onDismiss}>
            {keywords.addressAutoCompleteModalDismiss}
          </ModalHeaderButton>
        </ModalHeaderRow>

        <Combobox.Field {...getComboboxProps()}>
          <Combobox.Input
            {...getInputProps({
              ref: inputRef,
              placeholder,
            })}
          />
          {pickedPostalLine && isMatchingPickedSuggestion ? (
            <PostalAddress>{pickedPostalLine}</PostalAddress>
          ) : null}

          {value.length > 0 ? (
            <Combobox.ClearButton onClick={handleClearInput}>
              <Cross />
            </Combobox.ClearButton>
          ) : null}
        </Combobox.Field>
      </ModalHeader>

      <Combobox.List {...getMenuProps()}>
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
              <Combobox.OptionNotFound {...itemProps}>
                {keywords.addressAutoCompleteModalNotFound}
              </Combobox.OptionNotFound>
            )
          }

          return (
            <Combobox.Option {...itemProps}>
              <AddressOption address={item} />
            </Combobox.Option>
          )
        })}
      </Combobox.List>
    </Modal>
  )
}

export default AddressAutocomplete
