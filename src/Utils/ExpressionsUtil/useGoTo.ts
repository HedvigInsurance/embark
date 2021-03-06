import { ApiContext } from './../../Components/API/ApiContext'
import * as React from 'react'
import { StoreContext } from '../../Components/KeyValueStore'
import {
  ExternalRedirectContext,
  performExternalRedirect,
} from '../../externalRedirect'
import { passes } from './expression'

export const useGoTo = (
  data: any,
  onGoTo: (targetPassageId: string) => void,
): ((name: string) => void) => {
  const { store } = React.useContext(StoreContext)
  const { track } = React.useContext(ApiContext)
  const externalRedirectContext = React.useContext(ExternalRedirectContext)
  const [goTo, setGoTo] = React.useState<string | null>(null)
  const { setValue } = React.useContext(StoreContext)

  React.useEffect(() => {
    if (goTo) {
      const newPassage = data.passages.filter(
        (passage: any) => passage.name == goTo,
      )[0]
      const targetPassage = newPassage ? newPassage.id : data.startPassage

      if (newPassage.redirects.length > 0) {
        const passableExpressions = newPassage.redirects.filter(
          (expression: any) => {
            return passes(store, expression)
          },
        )

        if (passableExpressions.length > 0) {
          const {
            to,
            passedExpressionKey,
            passedExpressionValue,
          } = passableExpressions[0]
          const redirectTo = data.passages.find(
            (passage: any) => passage.name == to,
          )
          if (passedExpressionKey !== null && passedExpressionValue !== null) {
            setValue(passedExpressionKey, passedExpressionValue)
          }
          setGoTo(null)
          onGoTo(redirectTo.id)
          return
        }
      }

      if (newPassage.externalRedirect) {
        track('External Redirect', {
          redirectLocation: newPassage.externalRedirect.data.location,
        })
        setGoTo(null)
        performExternalRedirect(
          externalRedirectContext,
          newPassage.externalRedirect,
        )
        return
      }

      if (newPassage.offerRedirect) {
        track('Offer Redirect', {})
        setGoTo(null)
        const quoteIds = newPassage.offerRedirect.data.keys.map(
          (key: string) => store[key],
        )
        externalRedirectContext.Offer(quoteIds)
        return
      }

      onGoTo(targetPassage)
    }

    setGoTo(null)
  }, [goTo])

  return setGoTo
}
