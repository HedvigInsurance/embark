import * as React from 'react'
import { Provider } from './providers'
import { ApiContext } from '../../API/ApiContext'
import {
  ExternalInsuranceProviderEventEmitter,
  ExternalInsuranceProviderData,
} from '../../API/externalInsuranceProviderData'
import EventEmitter from 'eventemitter3'

export interface DataFetchOperation {
  id: string
  data?: ExternalInsuranceProviderData
  provider: Provider
}

export const DataFetchContext = React.createContext<{
  operation: DataFetchOperation | null
  endSession: () => void
  startSession: (id: string, provider: Provider, personalNumber: string) => void
}>({
  operation: null,
  startSession: () => {},
  endSession: () => {},
})

export const DataFetchContextProvider: React.FC = ({ children }) => {
  const { externalInsuranceProviderStartSession } = React.useContext(ApiContext)
  const [operation, setOperation] = React.useState<DataFetchOperation | null>(
    null,
  )
  const [session, setSession] = React.useState<EventEmitter<
    ExternalInsuranceProviderEventEmitter
  > | null>(null)

  React.useEffect(() => {
    if (session) {
      const listener = (data: ExternalInsuranceProviderData) => {
        if (operation) {
          setOperation({
            ...operation,
            data,
          })
        }
      }

      session.on('data', listener)

      return () => {
        session.removeListener('data', listener)
      }
    }

    return () => {}
  }, [session])

  return (
    <DataFetchContext.Provider
      value={{
        operation,
        endSession: () => {
          setOperation(null)
          setSession(null)
        },
        startSession: (id, provider, personalNumber) => {
          if (!provider.externalCollectionId) {
            throw new Error("can't initiate a session for this provider")
          }

          setSession(
            externalInsuranceProviderStartSession(
              id,
              provider.externalCollectionId,
              personalNumber,
            ),
          )
          setOperation({
            id,
            provider,
          })
        },
      }}
    >
      {children}
    </DataFetchContext.Provider>
  )
}
