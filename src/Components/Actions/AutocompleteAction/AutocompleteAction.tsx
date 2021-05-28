import * as React from 'react'
import { motion } from 'framer-motion'
import { StoreContext } from '../../KeyValueStore'
import { Tooltip } from '../../Tooltip'
import { Card, Input, Container, Spacer } from '../Common'
import styled from '@emotion/styled'
import { ContinueButton } from '../../ContinueButton'
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
  ComboboxButton,
} from '@reach/combobox'
import '@reach/combobox/styles.css'
import { AddressAutocompleteData } from '../../API/addressAutocomplete'

const BottomSpacedInput = styled(Input)`
  margin-bottom: 24px;

  @media (max-width: 600px) {
    margin-bottom: 16px;
  }
`.withComponent(ComboboxInput)

const StyledComboboxPopover = styled(ComboboxPopover)`
  border-top: 0;
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

const useAddressSearch = (searchTerm: string) => {
  const api = React.useContext(ApiContext)
  const [options, setOptions] = React.useState<AddressAutocompleteData[]>([])

  React.useEffect(() => {
    if (searchTerm.trim() !== '') {
      let isFresh = true
      api.addressAutocompleteQuery(searchTerm).then((newOptions) => {
        if (isFresh) setOptions(newOptions)
      })
      return () => {
        isFresh = false
      }
    }
  }, [searchTerm])

  return options
}

export const AutocompleteAction: React.FunctionComponent<AutocompleteActionProps> = (
  props,
) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { store, setValue } = React.useContext(StoreContext)
  const [textValue, setTextValue] = React.useState(store[props.storeKey] || '')

  const options = useAddressSearch(textValue)
  const selectedOption = options.find((item) => item.address === textValue)

  const canContinue = selectedOption?.id !== undefined
  const onContinue = () => {
    setValue(props.storeKey, textValue)
    setValue(`${props.passageName}Result`, textValue)
    props.onContinue()
  }

  const inputRef = useAutoFocus(!props.isTransitioning)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <Container>
      <Card
        loading={loading}
        isFocused={isFocused || isHovered}
        onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => {
          e.preventDefault()
          if (!canContinue) return
          onContinue()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {props.tooltip ? <Tooltip tooltip={props.tooltip} /> : null}

        <Combobox
          onSelect={(value) => {
            setTextValue(value)
            setTimeout(() => {
              buttonRef.current?.click()
            }, 1)
          }}
        >
          <ComboboxButton
            as="span"
            style={{ display: 'none' }}
            ref={buttonRef}
          />
          <BottomSpacedInput
            ref={inputRef}
            size={Math.max(props.placeholder.length, textValue.length)}
            placeholder={props.placeholder}
            onFocus={() => setIsFocused(true)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTextValue(e.target.value)
            }
            onBlur={() => {
              setIsFocused(false)
              animateScrollTo(0)
            }}
            autocomplete={false}
          />
          <StyledComboboxPopover portal={false}>
            <ComboboxList>
              {!canContinue
                ? options.map((item) => (
                    <ComboboxOption
                      key={item.id || item.address}
                      value={item.address}
                    />
                  ))
                : null}
            </ComboboxList>
          </StyledComboboxPopover>
        </Combobox>
        <input type="submit" style={{ display: 'none' }} />
      </Card>
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
            onClick={onContinue}
            disabled={!canContinue}
            text={(props.link || {}).label || 'Nästa'}
          />
        </motion.div>
      </motion.div>
    </Container>
  )
}
