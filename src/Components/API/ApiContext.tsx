import * as React from 'react'
import { Data as PData } from './personalInformation'
import { Variables as CQVariables, Data as CQData } from './createQuote'
import {
  personalInformationQueryMocks,
  createQuoteMocks,
  houseInformationMocks,
  addressAutocompleteMocksStep1,
  addressAutocompleteMocksStep2,
  addressAutocompleteMocksStep3,
} from '../../api-mocks'
import { Data as HData, Variables as HVariables } from './houseInformation'
import {
  ExternalInsuranceProviderStatus,
  ExternalInsuranceProviderEventEmitter,
} from './externalInsuranceProviderData'
import EventEmitter from 'eventemitter3'
import { introspectSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql, ExecutionResult } from 'graphql'
import { AddressAutocompleteData } from './addressAutocomplete'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://graphql.dev.hedvigit.com/graphql',
  cache: new InMemoryCache({
    typePolicies: { AutoCompleteResponse: { keyFields: ['address'] } },
  }),
})

const query = gql`
  query AutoComplete($term: String!) {
    autoCompleteAddress(input: $term) {
      id
      address
      streetName
      streetNumber
      floor
      apartment
      postalCode
      city
    }
  }
`

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export interface TApiContext {
  personalInformationApi: (personalNumber: string) => Promise<PData | Error>
  houseInformation: (variables: HVariables) => Promise<HData | Error>
  addressAutocompleteQuery: (
    searchTerm: string,
  ) => Promise<AddressAutocompleteData[]>
  createQuote: (variables: CQVariables) => Promise<CQData | Error>
  graphqlQuery: (
    query: string,
    variables: { [key: string]: any },
  ) => Promise<ExecutionResult<any>>
  graphqlMutation: (
    query: string,
    variables: { [key: string]: any },
  ) => Promise<ExecutionResult<any>>
  track: (eventName: string, payload: { [key: string]: any }) => void
  externalInsuranceProviderStartSession: (
    id: string,
    providerId: string,
    personalNumber: string,
  ) => EventEmitter<ExternalInsuranceProviderEventEmitter>
  externalInsuranceProviderProviderStatus: () => Promise<
    { id: string; functional: boolean }[]
  >
}

export const ApiContext = React.createContext<TApiContext>({
  personalInformationApi: (_) => {
    throw Error('Must provide an implementation for `personalInformationApi`')
  },
  houseInformation: () => {
    throw Error('Must provide an implementation for `houseInformation`')
  },
  addressAutocompleteQuery: () => {
    throw Error('Must provide an implementation for `addressAutocompleteQuery`')
  },
  createQuote: (_) => {
    throw Error('Must provide an implementation for `createQuote`')
  },
  track: () => {
    throw Error('Must provide an implementation for `track`')
  },
  graphqlQuery: () => {
    throw Error('Must provide an implementation for `graphqlQuery`')
  },
  graphqlMutation: () => {
    throw Error('Must provide an implementation for `graphqlMutation`')
  },
  externalInsuranceProviderStartSession: () => {
    throw Error(
      'Must provide an implementation for `externalInsuranceProviderStartSession`',
    )
  },
  externalInsuranceProviderProviderStatus: () => {
    throw Error(
      'Must provide an implementation for `externalInsuranceProviderProviderStatus`',
    )
  },
})

export const mockApiResolvers: TApiContext = {
  personalInformationApi: async (_) => {
    await timeout(500)
    return personalInformationQueryMocks[0].result.data as PData
  },
  houseInformation: async (_) => {
    await timeout(300)
    return houseInformationMocks[0]
  },
  addressAutocompleteQuery: async (term) => {
    const result = await client.query({ query, variables: { term } })
    return result.data?.autoCompleteAddress || []
  },
  createQuote: async (_) => {
    await timeout(300)
    return createQuoteMocks[0].result.data as CQData
  },
  track: (eventName, payload) => {
    console.log(`Tracking ${eventName} with payload:`, payload)
  },
  graphqlQuery: async (query, variables) => {
    const { HttpLink } = require('apollo-link-http')

    const link = new HttpLink({
      uri: 'https://graphql.dev.hedvigit.com/graphql',
    })
    const schema = await introspectSchema(link)

    addMockFunctionsToSchema({ schema })

    const result = await graphql(schema, query, null, null, variables)

    console.log('Got graphql result', result)

    return result
  },
  graphqlMutation: async (mutation, variables) => {
    const { HttpLink } = require('apollo-link-http')

    const link = new HttpLink({
      uri: 'https://graphql.dev.hedvigit.com/graphql',
    })
    const schema = await introspectSchema(link)

    addMockFunctionsToSchema({ schema })

    const result = await graphql(schema, mutation, null, null, variables)

    console.log('Got graphql result', result)

    return result
  },
  externalInsuranceProviderProviderStatus: async () => {
    await timeout(300)

    return [
      { id: 'FOLKSAM', functional: true },
      { id: 'DINA', functional: false },
      { id: 'TRYGGHANSA', functional: true },
      { id: 'LANSFORSAKRINGAR', functional: true },
      { id: 'IF', functional: true },
    ]
  },
  externalInsuranceProviderStartSession: () => {
    const eventEmitter = new EventEmitter<
      ExternalInsuranceProviderEventEmitter
    >()

    setTimeout(() => {
      eventEmitter.emit('data', {
        status: ExternalInsuranceProviderStatus.CONNECTING,
      })
    }, 300)

    setTimeout(() => {
      eventEmitter.emit('data', {
        status: ExternalInsuranceProviderStatus.REQUIRES_AUTH,
      })
    }, 2000)

    setTimeout(() => {
      eventEmitter.emit('data', {
        status: ExternalInsuranceProviderStatus.FETCHING,
      })
    }, 8000)

    setTimeout(() => {
      eventEmitter.emit('data', {
        status: ExternalInsuranceProviderStatus.COMPLETED,
      })
    }, 20000)

    return eventEmitter
  },
}

export const MockApiContext: React.FunctionComponent = (props) => (
  <ApiContext.Provider value={mockApiResolvers}>
    {props.children}
  </ApiContext.Provider>
)
