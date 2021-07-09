import * as React from 'react'
import { motion } from 'framer-motion'
import { Tooltip } from '../../Tooltip'
import { Card as BaseCard, Spacer } from '../Common'
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
import useAddressSearch from './useAddressSearch'
import Modal from './Modal'
import useStoreAddress from './useStoreAddress'

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

const FakeInput = styled.span<{ isMuted: boolean }>`
  display: block;
  max-width: 100%;
  padding: 0 16px;
  font-size: 20px;
  line-height: 1.5;
  color: ${(props) => (props.isMuted ? colorsV3.gray500 : colorsV3.gray900)};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: text;

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

export const AddressAutocompleteAction: React.FC<AddressAutocompleteActionProps> = (
  props,
) => {
  const api = React.useContext(ApiContext)

  const { saveAddress, saveNotFound, initialAddress } = useStoreAddress({
    storeKey: props.storeKey,
    passageName: props.passageName,
  })

  const [isHovered, setIsHovered] = React.useState(false)

  const [isAutocompleteActive, setIsAutocompleteActive] = React.useState(false)

  const [
    confirmedAddress,
    setConfirmedAddress,
  ] = React.useState<CompleteAddress | null>(initialAddress)

  const [
    pickedSuggestion,
    setPickedSuggestion,
  ] = React.useState<AddressSuggestion | null>(() => confirmedAddress)

  const [searchTerm, setSearchTerm] = React.useState(() =>
    confirmedAddress ? formatAddressLine(confirmedAddress) : '',
  )

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

  const [suggestions, setSuggestions] = useAddressSearch(
    searchTerm,
    pickedSuggestion ?? undefined,
  )

  const handleSelectSuggestion = React.useCallback(
    async (suggestion: AddressSuggestion | null) => {
      setPickedSuggestion(suggestion)
      setSuggestions(null)

      if (suggestion) {
        setSearchTerm(formatAddressLine(suggestion))
        setConfirmedAddress(
          await confirmSuggestion(suggestion, pickedSuggestion),
        )
      }
    },
    [confirmSuggestion, pickedSuggestion, setSuggestions],
  )

  const handleChangeInput = React.useCallback((newValue: string) => {
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
  }, [])

  const handleButtonClick = () => {
    setIsAutocompleteActive(true)
  }

  const handleClearInput = React.useCallback(() => {
    setSearchTerm('')
    setPickedSuggestion(null)
    setConfirmedAddress(null)
  }, [])

  const handleContinue = React.useCallback(
    (address: CompleteAddress) => {
      saveAddress(address)
      props.onContinue()
    },
    [saveAddress, props.onContinue],
  )

  const handleNoAddressFound = React.useCallback(() => {
    setIsAutocompleteActive(false)
    saveNotFound(searchTerm)
    props.onContinue()
  }, [searchTerm, saveNotFound])

  const handleDismissModal = React.useCallback(
    () => setIsAutocompleteActive(false),
    [],
  )

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
              isMuted={confirmedAddressLine === undefined && searchTerm === ''}
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

      {confirmedAddress ? (
        <ContinueButton
          onClick={() => handleContinue(confirmedAddress)}
          disabled={false}
          text={(props.link || {}).label || 'Continue'}
        />
      ) : (
        <ContinueButton
          onClick={() => {}}
          disabled={true}
          text={(props.link || {}).label || 'Continue'}
        />
      )}

      <Modal isOpen={isAutocompleteActive} onDismiss={handleDismissModal}>
        <AddressAutocomplete
          onDismiss={handleDismissModal}
          onSelect={handleSelectSuggestion}
          onNotFound={handleNoAddressFound}
          value={searchTerm}
          onChange={handleChangeInput}
          onClear={handleClearInput}
          placeholder={props.placeholder}
          suggestions={suggestions}
        />
      </Modal>
    </Container>
  )
}
