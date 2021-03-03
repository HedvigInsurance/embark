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

const mapComputedStoreValuesList = (
  computedStoreValues: ReadonlyArray<ComputedStoreValues> | undefined,
) => {
  return computedStoreValues?.reduce(
    (acc, { key, value }) => ({ ...acc, [key]: value }),
    {},
  )
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
  return (
    <ExternalRedirectContext.Provider value={props.externalRedirects}>
      <ApiContext.Provider value={props.resolvers}>
        <DataFetchContextProvider>
          <KeywordsContext.Provider value={props.data.keywords}>
            <KeyValueStore
              initial={props.initialStore}
              computedStoreValues={mapComputedStoreValuesList(
                props.data.computedStoreValues,
              )}
            >
              <StoreListener {...props}>{props.children}</StoreListener>
            </KeyValueStore>
          </KeywordsContext.Provider>
        </DataFetchContextProvider>
      </ApiContext.Provider>
    </ExternalRedirectContext.Provider>
  )
}
