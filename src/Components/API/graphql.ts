import { getMultiActionItems } from './../Actions/MultiAction/util'
import get from 'lodash.get'
import { GraphQLError, ExecutionResult } from 'graphql'

import { GraphQLApiComponent, ApiComponent } from './apiComponent'
import { TApiContext } from './ApiContext'
import { Store } from '../KeyValueStore'
import {
  Variable,
  SingleVariable,
  MultiActionVariable,
  GeneratedVariable,
} from './../../Parsing/parseGraphQLApi'
import uuid from 'uuid'

export const isGraphqlApi = (t?: ApiComponent): t is GraphQLApiComponent =>
  t?.component === 'GraphQLApi'

const isMultiActionVariable = (
  variable: Variable,
): variable is MultiActionVariable => {
  if (variable.__typename === 'EmbarkAPIGraphQLMultiActionVariable') {
    return true
  }

  return false
}

const isGeneratedVariable = (
  variable: Variable,
): variable is GeneratedVariable => {
  if (variable.__typename === 'EmbarkAPIGraphQLGeneratedVariable') {
    return true
  }

  return false
}

const isSingleVariable = (variable: Variable): variable is SingleVariable => {
  if (variable.__typename === 'EmbarkAPIGraphQLSingleVariable') {
    return true
  }

  return false
}

const reduceVariables = (
  variables: Variable[],
  store: Store,
  setValue: (key: string, value: string) => void,
): { [key: string]: any } =>
  variables.reduce((curr, variable) => {
    if (isMultiActionVariable(variable)) {
      const storedItems = getMultiActionItems(store, variable.key, true)
      const items = Object.keys(storedItems).map((key) =>
        reduceVariables(variable.variables, storedItems[key], setValue),
      )

      return { ...curr, [variable.key]: items }
    }

    if (isGeneratedVariable(variable)) {
      const generatedValue = uuid()
      setValue(variable.storeAs, generatedValue)
      return { ...curr, [variable.key]: generatedValue }
    }

    if (isSingleVariable(variable)) {
      if (store[variable.from] === undefined || store[variable.from] === null) {
        return { ...curr, [variable.key]: null }
      }

      switch (variable.as) {
        case 'string':
          return { ...curr, [variable.key]: String(store[variable.from]) }
        case 'int':
          return { ...curr, [variable.key]: parseInt(store[variable.from]) }
        case 'boolean':
          return {
            ...curr,
            [variable.key]: String(store[variable.from]) === 'true',
          }
        default:
          return { ...curr, [variable.key]: store[variable.from] }
      }
    }

    return curr
  }, {})

export const graphQLApiHandler = async (
  component: ApiComponent,
  apiContext: TApiContext,
  store: Store,
  setValue: (key: string, value: string) => void,
  changePassage: (name: string) => void,
) => {
  if (!isGraphqlApi(component)) {
    throw new Error('passed non graphql api to graphQLApiHandler')
  }

  try {
    const variables = reduceVariables(component.data.variables, store, setValue)

    console.log('doing graphql call with variables', variables)

    const handleErrors = (graphqlResult: ExecutionResult<any>) => {
      const error = component.data.errors.find((error) =>
        graphqlResult
          .errors!.map((graphQLError: GraphQLError) => {
            if (error.contains) {
              return graphQLError.message.includes(error.contains)
            }

            return true
          })
          .includes(true),
      )

      if (error) {
        changePassage(error.next.name)
      }
    }

    const handleData = (graphqlResult: ExecutionResult<any>) => {
      component.data.results.forEach((result) => {
        setValue(result.as, get(graphqlResult.data!, result.key))
      })

      changePassage(component.data.next.name)
    }

    if (component.data.query) {
      const graphqlQueryResult = await apiContext.graphqlQuery(
        component.data.query,
        variables,
      )

      if (graphqlQueryResult.errors) {
        handleErrors(graphqlQueryResult)
      } else if (graphqlQueryResult.data) {
        handleData(graphqlQueryResult)
      }

      return
    } else if (component.data.mutation) {
      const graphqlMutationResult = await apiContext.graphqlMutation(
        component.data.mutation,
        variables,
      )

      if (graphqlMutationResult.errors) {
        handleErrors(graphqlMutationResult)
      } else if (graphqlMutationResult.data) {
        handleData(graphqlMutationResult)
      }

      return
    }

    throw new Error('neither mutation or query was passed to graphql api')
  } catch (e) {
    console.log(e)
    return
  }
}
