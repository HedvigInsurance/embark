import * as React from 'react'
import styled from '@emotion/styled'
import { ContinueButton } from '../../ContinueButton'
import { StoreContext } from '../../KeyValueStore'
import {
  isValid,
  mapMaskedValue,
  mapUnmaskedValue,
  unmaskValue,
} from '../masking'
import { ApiComponent } from '../../API/apiComponent'
import { Loading } from '../../API/Loading'
import { ApiContext } from '../../API/ApiContext'
import { callApi } from '../../API'
import { TextEditCard } from './TextEditCard'
import { mediaCardCount } from '../../Utils/cardCount'
import { useAutoFocus } from '../../../Utils/useAutoFocus'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 100%;
`

const CardsContainer = styled.form<{ cardCount: number }>`
  display: flex;
  justify-content: center;
  max-width: 100%;
  border-radius: 8px;

  ${(props) => mediaCardCount(props.cardCount)`
      display: flex;
      flex-direction: column;
  `};
`

const Spacer = styled.div`
  height: 20px;
`

interface Props {
  isTransitioning: boolean
  api?: ApiComponent
  passageName: string
  action: any
  changePassage: (name: string) => void
}

interface State {
  values: { [key: string]: string }
  continueDisabled: boolean
}

interface Action {
  type: 'setValue'
  key: string
  value: string
  textActions: any
}

const isDisabled = (textActions: any) => (
  values: Record<string, string>,
): boolean =>
  Object.keys(values)
    .map(
      (key) =>
        values[key] === null ||
        values[key] === '' ||
        !isValid(findMask(textActions, key), values[key]),
    )
    .includes(true)

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setValue':
      const newValues = { ...state.values, [action.key]: action.value }
      return {
        ...state,
        values: newValues,
        continueDisabled: isDisabled(action.textActions)(newValues),
      }
    default:
      return state
  }
}

const findMask = (textActions: any, key: string) => {
  const action = textActions.filter((action: any) => action.data.key === key)[0]
  if (action) {
    return action.data.mask
  }

  return undefined
}

export const TextActionSet: React.FunctionComponent<Props> = (props) => {
  const { setValue, store } = React.useContext(StoreContext)
  const [loading, setLoading] = React.useState(false)
  const [state, dispatch] = React.useReducer(reducer, undefined, () => {
    const values = props.action.data.textActions.reduce(
      (acc: { [key: string]: any }, curr: any) => {
        return {
          ...acc,
          [curr.data.key]:
            mapMaskedValue(
              store[curr.data.key],
              findMask(props.action.data.textActions, curr.data.key),
            ) || null,
        }
      },
      {},
    )

    return {
      values,
      continueDisabled: isDisabled(props.action.data.textActions)(values),
    }
  })
  const api = React.useContext(ApiContext)

  const onContinue = () => {
    const unmaskedValues = Object.keys(state.values).reduce<{
      [key: string]: any
    }>((acc, key) => {
      const mask = findMask(props.action.data.textActions, key)
      return {
        ...acc,
        [key]: mapUnmaskedValue(unmaskValue(state.values[key], mask), mask),
      }
    }, {})
    Object.entries(unmaskedValues).forEach(([key, value]) => {
      setValue(key, value)
    })
    setValue(
      `${props.passageName}Result`,
      Object.keys(state.values).reduce(
        (acc, curr) => `${acc} ${state.values[curr]}`,
        '',
      ),
    )
    if (props.api) {
      setLoading(true)
      callApi(
        props.api,
        api,
        { ...store, ...unmaskedValues },
        setValue,
        props.changePassage,
      )
    } else {
      props.changePassage(props.action.data.link.name)
    }
  }

  const inputRef = useAutoFocus(!props.isTransitioning)

  return (
    <Container>
      <CardsContainer
        onSubmit={(e) => {
          e.preventDefault()
          if (state.continueDisabled) {
            return
          }
          onContinue()
        }}
        cardCount={props.action.data.textActions.length || 0}
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            {props.action.data.textActions.map(
              (textAction: any, index: number) => (
                <TextEditCard
                  inputRef={index === 0 ? inputRef : undefined}
                  textAction={textAction}
                  cardCount={props.action.data.textActions.length || 0}
                  autoFocus={index === 0}
                  onChange={(value) => {
                    dispatch({
                      type: 'setValue',
                      key: textAction.data.key,
                      value,
                      textActions: props.action.data.textActions,
                    })
                  }}
                  value={state.values[textAction.data.key] || ''}
                />
              ),
            )}
          </>
        )}
        <input type="submit" style={{ display: 'none' }} />
      </CardsContainer>
      <Spacer />
      <ContinueButton
        disabled={state.continueDisabled}
        text={props.action.data.link.label}
        onClick={onContinue}
      />
    </Container>
  )
}
