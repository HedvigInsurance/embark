import * as React from 'react'
import { useGoTo } from './ExpressionsUtil'

interface State {
  history: string[]
  passageId: null | string
  data: null | any
}

type Action =
  | { type: 'GO_TO'; passageId: string }
  | { type: 'SET_STATE'; state: State }
  | { type: 'GO_BACK' }

const shouldBeAddedToHistory = (passage: any) => {
  if (passage.api) {
    return false
  }

  if (passage.externalRedirect || passage.offerRedirect) {
    return false
  }

  return true
}

const reducer: (state: State, action: Action) => State = (state, action) => {
  switch (action.type) {
    case 'GO_TO':
      if (state.passageId === action.passageId) {
        return state
      }

      const passage = state.data.passages.find(
        (passage: any) => passage.id == action.passageId,
      )

      if (!shouldBeAddedToHistory(passage)) {
        return {
          ...state,
          history: [...state.history],
          passageId: action.passageId,
        }
      }

      return {
        ...state,
        history: [...state.history, action.passageId],
        passageId: action.passageId,
      }
    case 'GO_BACK':
      const historyLength = state.history.length
      return {
        ...state,
        history: state.history.slice(0, -1),
        passageId: state.history[historyLength - 2],
      }
    case 'SET_STATE':
      return {
        ...action.state,
      }
    default:
      return state
  }
}

export const useEmbark = (
  getInitialState: () => State,
): {
  reducer: [State, React.Dispatch<Action>]
  goTo: (name: string) => void
} => {
  const [state, dispatch] = React.useReducer(reducer, null, getInitialState)

  const goTo = useGoTo(state.data, (targetPassageId) => {
    dispatch({
      type: 'GO_TO',
      passageId: targetPassageId,
    })
  })

  return {
    reducer: [state, dispatch],
    goTo,
  }
}
