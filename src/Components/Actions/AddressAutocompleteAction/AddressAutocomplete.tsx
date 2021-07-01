import * as React from 'react'
import styled from '@emotion/styled'
import { useCombobox } from 'downshift'
import { AddressSuggestion } from '../../API/addressAutocomplete'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { Cross } from '../../Icons/Cross'
import Modal from './Modal'
import Combobox from './Combobox'
import useAddressSearch from './useAddressSearch'
import { formatAddressLines } from './utils'
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
  font-weight: bold;
`

const DismissButton = styled.button`
  border: 0;
  background: transparent;
  padding: 4px 2px;
  border-radius: 4px;
  appearance: none;
  outline: 0;
  position: relative;
  z-index: 2;
  cursor: pointer;

  color: ${colorsV3.black};
  font-family: ${fonts.FAVORIT};
  font-size: 16px;

  &:focus {
    border-radius: 4px;
    box-shadow: 0 0 0 2px ${colorsV3.purple300};
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
  onClear: () => void
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
    onClear,
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
    reset,
  } = useCombobox<AddressSuggestion>({
    inputValue: value,
    items: comboboxItems,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem?.address === ADDRESS_NOT_FOUND) {
        onNotFound()
      } else {
        onSelect(selectedItem ?? null)
      }

      // Reset list of suggestions
      setSuggestions(null)
      inputRef.current?.focus()
    },
  })

  const handleClearInput = React.useCallback(() => {
    inputRef.current?.focus()
    reset()
    onClear()
  }, [])

  return (
    <Modal isOpen={isActive} onDismiss={onDismiss}>
      <ModalHeader>
        <ModalHeaderRow>
          <ModalHeaderLabel>
            {keywords.addressAutoCompleteModalTitle}
          </ModalHeaderLabel>
          <DismissButton onClick={onDismiss}>
            {keywords.addressAutoCompleteModalDismiss}
          </DismissButton>
        </ModalHeaderRow>

        <Combobox.Field {...getComboboxProps()}>
          <Combobox.Input
            {...getInputProps({
              ref: inputRef,
              placeholder,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                onChange(event.target.value),
            })}
          />

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
