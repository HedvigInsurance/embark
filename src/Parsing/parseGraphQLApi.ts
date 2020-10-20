import { getFirstLevelNodes, parseLinks } from './utils'

export type Variable = SingleVariable | GeneratedVariable | MultiActionVariable

export interface SingleVariable {
  __typename: string
  key: string
  from: string
  as: string
}

enum GeneratedVariableType {
  uuid = 'uuid',
}

export interface GeneratedVariable {
  __typename: string
  key: string
  type: GeneratedVariableType
  storeAs: string
}

export interface MultiActionVariable {
  __typename: string
  key: string
  variables: Variable[]
}

const parseVariables = (element: Element): SingleVariable => {
  const key = element.getAttribute('key')
  const from = element.getAttribute('from')
  const as = element.getAttribute('as')

  return {
    __typename: 'EmbarkAPIGraphQLSingleVariable',
    key: key || '',
    from: from || '',
    as: as || '',
  }
}

const parseGeneratedVariables = (element: Element): GeneratedVariable => {
  const key = element.getAttribute('key')
  const type = element.getAttribute('type')
  const storeAs = element.getAttribute('storeAs')

  if (type !== 'uuid') {
    throw new Error(`passed not allowed type ${type} as generated variable`)
  }

  return {
    __typename: 'EmbarkAPIGraphQLGeneratedVariable',
    key: key || '',
    type: GeneratedVariableType.uuid,
    storeAs: storeAs || '',
  }
}

const parseMultiActionVariables = (element: Element): MultiActionVariable => {
  const key = element.getAttribute('key')!
  const variables = Array.from(element.getElementsByTagName('variable')).map(
    parseVariables,
  )
  const generatedVariables = Array.from(
    element.getElementsByTagName('generatedvariable'),
  ).map(parseGeneratedVariables)
  const multiActionVariables = Array.from(
    element.getElementsByTagName('multiactionvariable'),
  ).map(parseMultiActionVariables)

  return {
    __typename: 'EmbarkAPIGraphQLMultiActionVariable',
    key,
    variables: [...variables, ...generatedVariables, ...multiActionVariables],
  }
}

const parseErrors = (element: Element) => {
  const contains = element.getAttribute('contains')
  const next = element.getAttribute('next')
  const nextLinks = parseLinks(next || '')

  return {
    contains,
    next: nextLinks && nextLinks[0],
  }
}

const parseResults = (element: Element) => {
  const key = element.getAttribute('key')
  const as = element.getAttribute('as')

  return {
    key,
    as,
  }
}

const parseCommonFields = (graphQLApi: Element) => {
  const nextLinks = parseLinks(graphQLApi.getAttribute('next') || '')
  const variables = Array.from(graphQLApi.getElementsByTagName('variable'))
    .filter((element) => element.parentElement == graphQLApi)
    .map(parseVariables)
  const generatedVariables = Array.from(
    graphQLApi.getElementsByTagName('generatedvariable'),
  ).map(parseGeneratedVariables)
  const multiActionVariables = Array.from(
    graphQLApi.getElementsByTagName('multiactionvariable'),
  ).map(parseMultiActionVariables)
  const errors = Array.from(graphQLApi.getElementsByTagName('error')).map(
    parseErrors,
  )
  const results = Array.from(graphQLApi.getElementsByTagName('result')).map(
    parseResults,
  )

  return {
    next: nextLinks && nextLinks[0],
    variables: [...variables, ...generatedVariables, ...multiActionVariables],
    errors,
    results,
  }
}

export const parseGraphQLApi = (
  element: Element,
  allowNestedChildren: boolean = true,
) => {
  const graphQLApi = element.getElementsByTagName('graphqlapi')[0]

  if (graphQLApi) {
    if (
      !allowNestedChildren &&
      !getFirstLevelNodes(element).includes(graphQLApi)
    ) {
      return null
    }

    const queryElement = graphQLApi.getElementsByTagName('query')[0]

    if (queryElement) {
      const query = queryElement.textContent

      return {
        __typename: 'EmbarkApiGraphQLQuery',
        component: 'GraphQLApi',
        data: {
          __typename: 'EmbarkApiGraphQLQueryData',
          ...parseCommonFields(graphQLApi),
          query,
        },
      }
    }

    const mutationElement = graphQLApi.getElementsByTagName('mutation')[0]
    const mutation = mutationElement.textContent

    return {
      __typename: 'EmbarkApiGraphQLMutation',
      component: 'GraphQLApi',
      data: {
        __typename: 'EmbarkApiGraphQLMutationData',
        ...parseCommonFields(graphQLApi),
        mutation,
      },
    }
  }

  return null
}
