import * as React from 'react'
import { motion } from 'framer-motion'
import { StoreContext } from '../../KeyValueStore'
import { Tooltip } from '../../Tooltip'
import { Card, Input, Container, Spacer } from '../Common'
import styled from '@emotion/styled'
import { ContinueButton } from '../../ContinueButton'
import { wrapWithMask } from '../masking'
import { callApi } from '../../API'
import { ApiContext } from '../../API/ApiContext'
import { ApiComponent } from '../../API/apiComponent'
import animateScrollTo from 'animated-scroll-to'
import { useAutoFocus } from '../../../Utils/useAutoFocus'

const BottomSpacedInput = styled(Input)`
  margin-bottom: 24px;

  @media (max-width: 600px) {
    margin-bottom: 16px;
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

const Masked = wrapWithMask(BottomSpacedInput)

export const AutocompleteAction: React.FunctionComponent<AutocompleteActionProps> = (
  props,
) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { store, setValue } = React.useContext(StoreContext)
  const [textValue, setTextValue] = React.useState(store[props.storeKey] || '')
  const api = React.useContext(ApiContext)

  const canContinue = textValue.length > 0
  const onContinue = () => {
    const newValues: { [key: string]: any } = {
      [props.storeKey]: textValue,
    }
    Object.entries(newValues).forEach(([key, value]) => setValue(key, value))
    setValue(`${props.passageName}Result`, textValue)
    if (props.api) {
      setLoading(true)
      callApi(
        props.api,
        api,
        { ...store, ...newValues },
        setValue,
        props.onContinue,
      )
    } else {
      props.onContinue()
    }
  }

  const inputRef = useAutoFocus(!props.isTransitioning)

  return (
    <Container>
      <Card
        loading={loading}
        isFocused={isFocused || isHovered}
        onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => {
          e.preventDefault()

          if (!canContinue) {
            return
          }

          onContinue()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip tooltip={props.tooltip} />
        <BottomSpacedInput
          ref={inputRef}
          type="text"
          size={Math.max(props.placeholder.length, textValue.length)}
          placeholder={props.placeholder}
          value={textValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTextValue(e.target.value)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            animateScrollTo(0)
          }}
        />
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
