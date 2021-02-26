import React, { useEffect, useState } from 'react'
import {
  ComputedStoreValues,
  KeyValueStore,
  Store,
  StoreContext,
} from './KeyValueStore'
import { KeywordsContext } from './KeywordsContext'
import { TApiContext, ApiContext } from './API/ApiContext'
import {
  TExternalRedirectContext,
  ExternalRedirectContext,
} from '../externalRedirect'
import { DataFetchContextProvider } from './Actions/ExternalInsuranceProviderAction/DataFetchContext'

interface EmbarkProviderProps {
  data: any
  resolvers: TApiContext
  externalRedirects: TExternalRedirectContext
  onStoreChange?: (store: Store) => void
  initialStore?: Store
}

const StoreListener: React.FunctionComponent<EmbarkProviderProps> = (props) => {
  const { store } = React.useContext(StoreContext)

  React.useEffect(() => {
    props.onStoreChange && props.onStoreChange(store)
  }, [store])

  return <>{props.children}</>
}

export const EmbarkProvider: React.FunctionComponent<EmbarkProviderProps> = (
  props,
) => {
  const [computedStoreValues, setComputedStoreValues] = useState<
    ComputedStoreValues
  >({})

  useEffect(() => {
    if (props.data.computedStoreValues) {
      const parsedComputedStoreValues = (props.data
        .computedStoreValues as ReadonlyArray<ComputedStoreValues>).reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {},
      )
      setComputedStoreValues(parsedComputedStoreValues)
    }
  }, [props.data.computedStoreValues])

  return (
    <ExternalRedirectContext.Provider value={props.externalRedirects}>
      <ApiContext.Provider value={props.resolvers}>
        <DataFetchContextProvider>
          <KeywordsContext.Provider value={props.data.keywords}>
            <KeyValueStore
              initial={props.initialStore}
              computedStoreValues={computedStoreValues}
            >
              <StoreListener {...props}>{props.children}</StoreListener>
            </KeyValueStore>
          </KeywordsContext.Provider>
        </DataFetchContextProvider>
      </ApiContext.Provider>
    </ExternalRedirectContext.Provider>
  )
}
