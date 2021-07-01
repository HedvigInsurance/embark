import * as React from 'react'
import { motion } from 'framer-motion'
import { StoreContext, Store } from '../../KeyValueStore'
import { Tooltip } from '../../Tooltip'
import { Card as BaseCard, Input, Spacer } from '../Common'
import styled from '@emotion/styled'
import { ApiContext } from '../../API/ApiContext'
import { ApiComponent } from '../../API/apiComponent'
import {
  AddressSuggestion,
  CompleteAddress,
} from '../../API/addressAutocomplete'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { ContinueButton } from '../../ContinueButton'
import {
  formatAddressLine,
  formatAddressLines,
  isCompleteAddress,
  isSameAddress,
} from './utils'
import AddressAutocomplete from './AddressAutocomplete'

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
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const Card = styled(BaseCard)`
  width: 100%;
`

const Button = styled.button`
  width: 100%;
  padding: 16px 0;
  border: none;
  outline: none;
  background: none;
  appearance: none;
  cursor: text;

  @media (min-width: 600px) {
    padding: 24px 0;
  }
`

const FakeInput = styled.span<{ fakePlaceholder: boolean }>`
  max-width: 100%;
  padding: 0 16px;
  font-size: 20px;
  line-height: 1.5;
  color: ${(props) =>
    props.fakePlaceholder ? colorsV3.gray500 : colorsV3.gray900};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: text;

  ::placeholder {
    -webkit-text-fill-color: ${colorsV3.gray500};
  }

  @media (min-width: 600px) {
    padding: 0 32px;
    font-size: 48px;
    line-height: 1.25;
  }
`

const PostalAddress = styled.span`
  display: block;
  font-family: ${fonts.FAVORIT}, sans-serif;
  font-size: 16px;
  text-align: center;
  color: ${colorsV3.gray700};
  margin: 0;

  @media (min-width: 600px) {
    font-size: 24px;
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

const collectAddressSubmission = (address: CompleteAddress) => {
  const data = {
    [STORE_KEY.ID]: address.id,
    [STORE_KEY.STREET]: `${address.streetName} ${address.streetNumber}`,
    [STORE_KEY.ZIP_CODE]: address.postalCode,
    [STORE_KEY.CITY]: address.city,
    [STORE_KEY.STREET_NAME]: address.streetName,
    [STORE_KEY.STREET_NUMBER]: address.streetNumber,

    [STORE_KEY.ADDRESS]: address.address,
  }

  if (address.floor) {
    data[STORE_KEY.FLOOR] = address.floor
  }

  if (address.apartment) {
    data[STORE_KEY.APARTMENT] = address.apartment
  }

  return data
}

export const AddressAutocompleteAction: React.FC<AddressAutocompleteActionProps> = (
  props,
) => {
  const api = React.useContext(ApiContext)

  const [isHovered, setIsHovered] = React.useState(false)
  const { store, setValue, removeValues } = React.useContext(StoreContext)

  const [isAutocompleteActive, setIsAutocompleteActive] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')

  const [
    pickedSuggestion,
    setPickedSuggestion,
  ] = React.useState<AddressSuggestion | null>(() => getAddressFromStore(store))

  const [
    confirmedAddress,
    setConfirmedAddress,
  ] = React.useState<CompleteAddress | null>(() => getAddressFromStore(store))

  const confirmSuggestion = React.useCallback(
    async (
      newSuggestion: AddressSuggestion,
      prevSuggestion: AddressSuggestion | null,
    ) => {
      if (!isCompleteAddress(newSuggestion)) return null

      if (newSuggestion.floor && newSuggestion.apartment) return newSuggestion

      if (prevSuggestion && isSameAddress(prevSuggestion, newSuggestion))
        return newSuggestion

      const results = await api.addressAutocompleteQuery(
        newSuggestion.address,
        { type: 'APARTMENT' },
      )
      if (results.length === 1) return newSuggestion

      return null
    },
    [api],
  )

  const handleSelectSuggestion = React.useCallback(
    async (suggestion: AddressSuggestion | null) => {
      setPickedSuggestion(suggestion)

      if (suggestion) {
        setSearchTerm(formatAddressLine(suggestion))
        setConfirmedAddress(
          await confirmSuggestion(suggestion, pickedSuggestion),
        )
      }
    },
    [confirmSuggestion, pickedSuggestion],
  )

  const handleChangeInput = React.useCallback(
    (newValue: string) => {
      setSearchTerm(newValue)

      // Reset picked suggestion for empty input field
      if (!newValue) {
        setPickedSuggestion(null)
      }

      setConfirmedAddress((prevValue) => {
        // Reset confirmed address unless it matches the updated search term
        if (prevValue && newValue !== formatAddressLine(prevValue)) {
          return null
        }

        return prevValue
      })
    },
    [store],
  )

  const handleButtonClick = () => {
    setIsAutocompleteActive(true)
  }

  const handleClearInput = React.useCallback(() => {
    setSearchTerm('')
    setPickedSuggestion(null)
    setConfirmedAddress(null)
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

      Object.entries(collectAddressSubmission(address)).forEach(
        ([key, value]) => {
          setValue(key, value)
        },
      )

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
    setIsAutocompleteActive(false)
    clearStoreValues()

    setValue(STORE_KEY.ADDRESS_SEARCH_TERM, searchTerm)
    setValue(props.storeKey, ADDRESS_NOT_FOUND)
    props.onContinue()
  }, [clearStoreValues, setValue, props.storeKey, searchTerm])

  // @ts-ignore: clean-up function only needed conditionally
  React.useEffect(() => {
    if (confirmedAddress) {
      setIsAutocompleteActive(false)

      const handleEnter = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          handleContinue(confirmedAddress)
        }
      }

      window.addEventListener('keydown', handleEnter)
      return () => window.removeEventListener('keydown', handleEnter)
    }
  }, [confirmedAddress])

  const [confirmedAddressLine, confirmedPostalLine] = confirmedAddress
    ? formatAddressLines(confirmedAddress)
    : []

  const fakeInputText = confirmedAddressLine || searchTerm || props.placeholder
  return (
    <Container>
      <motion.div
        animate={{
          opacity: isAutocompleteActive ? 0 : 1,
        }}
        transition={{ ease: 'easeOut', duration: 0.25 }}
        style={{ maxWidth: '100%' }}
      >
        <Card
          isFocused={isHovered}
          onSubmit={(event) => event.preventDefault()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {props.tooltip ? <Tooltip tooltip={props.tooltip} /> : null}
          <Button onClick={handleButtonClick}>
            <FakeInput
              fakePlaceholder={confirmedAddressLine === '' || searchTerm === ''}
            >
              {fakeInputText}
            </FakeInput>
            {confirmedPostalLine ? (
              <PostalAddress>{confirmedPostalLine}</PostalAddress>
            ) : null}
          </Button>
        </Card>
      </motion.div>

      <Spacer />

      <ContinueButton
        onClick={() => handleContinue(confirmedAddress!)}
        disabled={!confirmedAddress}
        text={(props.link || {}).label || 'Continue'}
      />

      <AddressAutocomplete
        isActive={isAutocompleteActive}
        onDismiss={() => setIsAutocompleteActive(false)}
        selected={pickedSuggestion}
        onSelect={handleSelectSuggestion}
        onNotFound={handleNoAddressFound}
        value={searchTerm}
        onChange={handleChangeInput}
        onClear={handleClearInput}
        placeholder={props.placeholder}
      />
    </Container>
  )
}
