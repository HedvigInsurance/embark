import { parseGraphQLApi } from './parseGraphQLApi'
import { getFirstLevelNodes, parseLinks } from './utils'
import { resolvePlaceholders } from '@hedviginsurance/textkeyfy'

type Translator = (text: string) => string

const parseTooltips = (containerElement: Element, translate: Translator) => {
  const tooltips = Array.from(containerElement.getElementsByTagName('Tooltip'))

  return tooltips.map(parseTooltip(translate))
}

const parseTooltip = (translate: Translator) => (element: Element) => {
  const title = translate(
    element.getElementsByTagName('Title')[0].textContent || '',
  ).trim()
  const description = translate(
    element.getElementsByTagName('Description')[0].textContent || '',
  ).trim()

  return {
    __typename: 'EmbarkTooltip',
    title,
    description,
  }
}

/*
<ExternalRedirect to="Offer"></ExternalRedirect>
*/

const parseExternalRedirect = (containerElement: Element) => {
  const node = containerElement.getElementsByTagName('ExternalRedirect')[0]

  if (!node) {
    return null
  }

  const location = node.getAttribute('to')

  return {
    component: 'ExternalRedirect',
    data: {
      location,
    },
  }
}

const getPotentiallyMultipleItemsFromKeyOrValue = (
  keyOrValue: string | null,
  translate: Translator = (str) => str,
): Array<String> => {
  if (!keyOrValue) {
    return []
  }

  if (keyOrValue.startsWith('[') && keyOrValue.endsWith(']')) {
    const withoutBrackets = keyOrValue.replace(/[\[\]]/g, '')
    return translate(withoutBrackets).split(',')
  }

  return [translate(keyOrValue)]
}

const getSelectAction = (
  actionNode: Element | undefined,
  translate: Translator,
) => {
  if (!actionNode) {
    return null
  }

  const actionNodeOptions = Array.from(
    actionNode.getElementsByTagName('option'),
  ).map((option) => {
    const links = parseLinks(translate(option.textContent || ''))

    const key = option.getAttribute('key')
    const value = option.getAttribute('value')

    const keys = getPotentiallyMultipleItemsFromKeyOrValue(key)
    const values = getPotentiallyMultipleItemsFromKeyOrValue(value, translate)

    const tooltips = parseTooltips(option, translate)

    const api = parseApi(option)

    return {
      key,
      value,
      keys,
      values,
      link: links ? links[0] : null,
      tooltip: tooltips[0] ? tooltips[0] : null,
      api,
      __typename: 'EmbarkSelectActionOption',
    }
  })

  return {
    __typename: 'EmbarkSelectAction',
    component: 'SelectAction',
    data: {
      __typename: 'EmbarkSelectActionData',
      options: actionNodeOptions,
    },
  }
}

const getNumberAction = (numberActionNode: Element, translate: Translator) => {
  const placeholder = translate(
    numberActionNode.getAttribute('placeholder') || '',
  )
  const next = translate(numberActionNode.getAttribute('next') || '')
  const key = numberActionNode.getAttribute('key')
  const unit = translate(numberActionNode.getAttribute('unit') || '')
  const mask = numberActionNode.getAttribute('mask')
  const minValue = numberActionNode.getAttribute('minvalue')
  const maxValue = numberActionNode.getAttribute('maxvalue')

  const links = parseLinks(next)
  const tooltip = parseTooltips(numberActionNode, translate)[0]
  const api = parseApi(numberActionNode)

  return {
    __typename: 'EmbarkNumberAction',
    component: 'NumberAction',
    data: {
      placeholder,
      key,
      unit,
      api,
      minValue,
      maxValue,
      ...(links && { link: links[0] }),
      mask,
      ...(tooltip && { tooltip }),
    },
  }
}

const getDropdownAction = (
  dropdownActionNode: Element,
  translate: Translator,
) => {
  const key = dropdownActionNode.getAttribute('key')
  const label = translate(dropdownActionNode.getAttribute('label') || '')
  const options = Array.from(
    dropdownActionNode.getElementsByTagName('option'),
  ).map((option) => {
    return {
      value: translate(
        option.getAttribute('value') || option.textContent || '',
      ),
      text: translate(option.textContent || ''),
    }
  })

  return {
    __typename: 'EmbarkDropdownAction',
    component: 'DropdownAction',
    data: {
      label,
      key,
      options,
    },
  }
}

const getSwitchAction = (switchActionNode: Element) => {
  const key = switchActionNode.getAttribute('key')
  const label = switchActionNode.getAttribute('label') || ''
  const defaultValue = switchActionNode.getAttribute('defaultvalue') === 'true'

  return {
    __typename: 'EmbarkSwitchAction',
    component: 'SwitchAction',
    data: {
      label,
      key,
      defaultValue,
    },
  }
}

const getMultiAction = (multiActionNode: Element, translate: Translator) => {
  const maxAmount = translate(multiActionNode.getAttribute('maxamount') || '')
  const key = multiActionNode.getAttribute('key')
  const components: Array<any> = []
  const next = translate(multiActionNode.getAttribute('next') || '')

  const links = parseLinks(next || '')

  const addNode = multiActionNode.getElementsByTagName('add')[0]
  const addLabel = addNode.getAttribute('label')

  Array.from(addNode.getElementsByTagName('dropdownaction')).forEach(
    (dropdownNode) => {
      components.push(getDropdownAction(dropdownNode, translate))
    },
  )

  Array.from(addNode.getElementsByTagName('numberaction')).forEach(
    (numberActionNode) => {
      components.push(getNumberAction(numberActionNode, translate))
    },
  )

  Array.from(addNode.getElementsByTagName('switchaction')).forEach(
    (switchActionNode) => {
      components.push(getSwitchAction(switchActionNode))
    },
  )

  const api = parseApi(multiActionNode)

  return {
    __typename: 'EmbarkMultiAction',
    component: 'MultiAction',
    data: {
      key,
      addLabel,
      components,
      maxAmount,
      api,
      link: links && links[0],
    },
  }
}

const getNumberActionSet = (
  numberActionSetNode: Element,
  translate: Translator,
) => {
  const next = numberActionSetNode.getAttribute('next')
  const links = parseLinks(next || '')

  const numberActions = Array.from(
    numberActionSetNode.getElementsByTagName('numberaction'),
  ).map((numberActionNode) => {
    const numberAction = getNumberAction(numberActionNode, translate)

    return {
      ...numberAction,
      data: {
        title: translate(numberActionNode.getAttribute('title') || ''),
        ...numberAction.data,
      },
    }
  })

  return {
    __typename: 'EmbarkNumberActionSet',
    component: 'NumberActionSet',
    data: {
      link: links && links[0],
      numberActions,
    },
  }
}

const getTextActionSet = (
  textActionSetNode: Element,
  translate: Translator,
) => {
  const next = textActionSetNode.getAttribute('next')
  const links = parseLinks(translate(next || ''))

  const textActions = Array.from(
    textActionSetNode.getElementsByTagName('textaction'),
  ).map((textActionNode) => {
    const textAction = getTextAction(textActionNode, translate)

    return {
      ...textAction,
      data: {
        ...textAction.data,
        title: translate(textActionNode.getAttribute('title') || ''),
        __typename: 'EmbarkTextActionSetTextAction',
      },
    }
  })

  const api = parseApi(textActionSetNode)

  return {
    __typename: 'EmbarkTextActionSet',
    component: 'TextActionSet',
    data: {
      __typename: 'EmbarkTextActionSetData',
      link: links && links[0],
      textActions,
      api,
    },
  }
}

const getTextAction = (textActionNode: Element, translate: Translator) => {
  const placeholder = translate(
    textActionNode.getAttribute('placeholder') || '',
  )
  const next = translate(textActionNode.getAttribute('next') || '')
  const key = textActionNode.getAttribute('key')
  const mask = textActionNode.getAttribute('mask')

  const large = textActionNode.getAttribute('large')

  const links = next ? parseLinks(next) : []
  const tooltip = parseTooltips(textActionNode, translate)[0]

  const api = parseApi(textActionNode)

  return {
    __typename: 'EmbarkTextAction',
    component: 'TextAction',
    data: {
      placeholder,
      key,
      api,
      link: links && links[0],
      large,
      mask,
      ...(tooltip && { tooltip }),
    },
  }
}

const getExternalInsuranceProviderAction = (
  externalInsuranceProviderActionNode: Element,
  translate: Translator,
) => {
  const next = translate(
    externalInsuranceProviderActionNode.getAttribute('next') || '',
  )
  const skip = translate(
    externalInsuranceProviderActionNode.getAttribute('skip') || '',
  )
  const skipLinks = skip ? parseLinks(skip) : []
  const nextLinks = next ? parseLinks(next) : []

  return {
    __typename: 'EmbarkExternalInsuranceProviderAction',
    component: 'ExternalInsuranceProviderAction',
    data: {
      next: nextLinks && nextLinks[0],
      skip: skipLinks && skipLinks[0],
    },
  }
}

const getPreviousInsuranceProviderAction = (
  previousInsuranceProviderActionNode: Element,
  translate: Translator,
) => {
  const next = translate(
    previousInsuranceProviderActionNode.getAttribute('next') || '',
  )
  const skip = translate(
    previousInsuranceProviderActionNode.getAttribute('skip') || '',
  )
  const skipLinks = skip ? parseLinks(skip) : []
  const nextLinks = next ? parseLinks(next) : []
  const providers = previousInsuranceProviderActionNode.getAttribute(
    'providers',
  )
  const storeKey = previousInsuranceProviderActionNode.getAttribute('storeKey')

  const tooltip = parseTooltips(
    previousInsuranceProviderActionNode,
    translate,
  )[0]

  return {
    __typename: 'EmbarkPreviousInsuranceProviderAction',
    component: 'PreviousInsuranceProviderAction',
    data: {
      next: nextLinks && nextLinks[0],
      skip: skipLinks && skipLinks[0],
      providers,
      storeKey,
      ...(tooltip && { tooltip }),
    },
  }
}

const getAction = (containerElement: Element, translate: Translator) => {
  const numberActionSetNode = containerElement.getElementsByTagName(
    'numberactionset',
  )[0]

  if (numberActionSetNode) {
    return getNumberActionSet(numberActionSetNode, translate)
  }

  const textActionSetNode = containerElement.getElementsByTagName(
    'textactionset',
  )[0]

  if (textActionSetNode) {
    return getTextActionSet(textActionSetNode, translate)
  }

  const multiActionNode = containerElement.getElementsByTagName(
    'multiaction',
  )[0]

  if (multiActionNode) {
    return getMultiAction(multiActionNode, translate)
  }

  const selectActionNode = containerElement.getElementsByTagName(
    'selectaction',
  )[0]

  if (selectActionNode) {
    return getSelectAction(selectActionNode, translate)
  }

  const numberActionNode = containerElement.getElementsByTagName(
    'numberaction',
  )[0]

  if (numberActionNode) {
    return getNumberAction(numberActionNode, translate)
  }

  const textActionNode = containerElement.getElementsByTagName('textaction')[0]

  if (textActionNode) {
    return getTextAction(textActionNode, translate)
  }

  const externalInsuranceProviderActionNode = containerElement.getElementsByTagName(
    'externalinsuranceprovideraction',
  )[0]

  if (externalInsuranceProviderActionNode) {
    return getExternalInsuranceProviderAction(
      externalInsuranceProviderActionNode,
      translate,
    )
  }

  const previousInsuranceProviderActionNode = containerElement.getElementsByTagName(
    'previousinsuranceprovideraction',
  )[0]

  if (previousInsuranceProviderActionNode) {
    return getPreviousInsuranceProviderAction(
      previousInsuranceProviderActionNode,
      translate,
    )
  }

  return null
}

interface BinaryExpression {
  __typename: string
  type: string
  key: string
  value: string
}

interface UnaryExpression {
  __typename: string
  type: string
}

type SingleExpression = UnaryExpression | BinaryExpression

interface MultipleExpressions {
  __typename: string
  type: 'AND' | 'OR'
  subExpressions: Expression[]
}

type Expression = SingleExpression | MultipleExpressions

const AND_REGEX = /^(.+)&&(.+)$/
const OR_REGEX = /^(.+)\|\|(.+)$/

const parseExpression = (expression: string): Expression | null => {
  if (expression.includes('&&')) {
    const splitted = expression.match(AND_REGEX)

    if (!splitted) {
      return null
    }

    return {
      __typename: 'EmbarkExpressionMultiple',
      type: 'AND',
      subExpressions: [
        parseExpression(splitted[1].trim()),
        parseExpression(splitted[2].trim()),
      ] as Expression[],
    }
  }

  if (expression.includes('||')) {
    const splitted = expression.match(OR_REGEX)

    if (!splitted) {
      return null
    }

    return {
      __typename: 'EmbarkExpressionMultiple',
      type: 'OR',
      subExpressions: [
        parseExpression(splitted[1].trim()),
        parseExpression(splitted[2].trim()),
      ] as Expression[],
    }
  }

  if (expression.includes('==')) {
    const splitted = expression.split('==')

    return {
      __typename: 'EmbarkExpressionBinary',
      type: 'EQUALS',
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, ''),
    }
  }

  if (expression.includes('>=')) {
    const splitted = expression.split('>=')

    return {
      __typename: 'EmbarkExpressionBinary',
      type: 'MORE_THAN_OR_EQUALS',
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, ''),
    }
  }

  if (expression.includes('<=')) {
    const splitted = expression.split('<=')

    return {
      __typename: 'EmbarkExpressionBinary',
      type: 'LESS_THAN_OR_EQUALS',
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, ''),
    }
  }

  if (expression.includes('>')) {
    const splitted = expression.split('>')

    return {
      __typename: 'EmbarkExpressionBinary',
      type: 'MORE_THAN',
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, ''),
    }
  }

  if (expression.includes('<')) {
    const splitted = expression.split('<')

    return {
      __typename: 'EmbarkExpressionBinary',
      type: 'LESS_THAN',
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, ''),
    }
  }

  if (expression.includes('!=')) {
    const splitted = expression.split('!=')
    return {
      __typename: 'EmbarkExpressionBinary',
      type: 'NOT_EQUALS',
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, ''),
    }
  }

  if (expression == 'true') {
    return {
      __typename: 'EmbarkExpressionUnary',
      type: 'ALWAYS',
    }
  }

  if (expression == 'false') {
    return {
      __typename: 'EmbarkExpressionUnary',
      type: 'NEVER',
    }
  }

  return null
}

type TextKeyObject = Record<string, string>
type PossibleExpressionContentParser = (
  containerElement: Element,
) => { expressions: Expression[]; text: string }

const createParsePossibleExpressionContent = (
  translate: Translator,
): PossibleExpressionContentParser => (containerElement) => {
  const expressions = Array.from(containerElement.getElementsByTagName('When'))
    .map((when) => {
      const expressionText = when.getAttribute('expression') || ''
      const expression = parseExpression(expressionText)

      if (expression) {
        return {
          ...expression,
          text: translate(when.textContent || '').trim(),
        }
      }

      return null
    })
    .filter((expression) => expression) as Expression[]

  return {
    expressions,
    text: translate(containerElement.textContent || '').trim(),
  }
}

const getResponse = (
  passageName: string,
  containerElement: Element,
  parsePossibleExpressionContent: PossibleExpressionContentParser,
) => {
  const groupedResponse = containerElement.getElementsByTagName(
    'groupedresponse',
  )[0]
  if (groupedResponse) {
    return parseGroupedResponse(groupedResponse, parsePossibleExpressionContent)
  }

  const responseNode = containerElement.getElementsByTagName('response')[0]

  if (responseNode) {
    return {
      __typename: 'EmbarkResponseExpression',
      ...parsePossibleExpressionContent(responseNode),
    }
  }

  return {
    __typename: 'EmbarkMessage',
    expressions: [],
    text: `{${passageName}Result}`,
  }
}

const parseEach = (
  element: Element,
  parsePossibleExpressionContent: PossibleExpressionContentParser,
) => {
  const key = element.getAttribute('key')

  const content = parsePossibleExpressionContent(element)

  return {
    __typename: 'EmbarkGroupedResponseEach',
    key,
    content,
  }
}

const parseGroupedResponse = (
  element: Element,
  parsePossibleExpressionContent: PossibleExpressionContentParser,
) => {
  const title = element.getElementsByTagName('title')[0]
  const items = Array.from(element.getElementsByTagName('item'))
  const each = element.getElementsByTagName('each')[0]

  return {
    __typename: 'EmbarkGroupedResponse',
    component: 'GroupedResponse',
    title: {
      __typename: 'EmbarkResponseExpression',
      ...parsePossibleExpressionContent(title),
    },
    items: items.map(parsePossibleExpressionContent),
    each: (each && parseEach(each, parsePossibleExpressionContent)) || [],
  }
}

const parseApi = (element: Element, allowNestedChildren: boolean = true) => {
  const graphQLApi = parseGraphQLApi(element, allowNestedChildren)

  if (graphQLApi) {
    return graphQLApi
  }

  const personalInformationApi = element.getElementsByTagName(
    'personalinformationapi',
  )[0]

  if (personalInformationApi) {
    if (
      !allowNestedChildren &&
      !getFirstLevelNodes(element).includes(personalInformationApi)
    ) {
      return null
    }

    const match = personalInformationApi.getAttribute('match')
    const noMatch = personalInformationApi.getAttribute('noMatch')
    const error = personalInformationApi.getAttribute('error')

    const matchLinks = parseLinks(match || '')
    const noMatchLinks = parseLinks(noMatch || '')
    const errorLinks = parseLinks(error || '')

    return {
      __typename: 'EmbarkApiPersonalInformation',
      component: 'PersonalInformationApi',
      data: {
        match: matchLinks && matchLinks[0],
        noMatch: noMatchLinks && noMatchLinks[0],
        error: errorLinks && errorLinks[0],
      },
    }
  }

  const houseInformationApi = element.getElementsByTagName(
    'houseinformationapi',
  )[0]

  if (houseInformationApi) {
    if (
      !allowNestedChildren &&
      !getFirstLevelNodes(element).includes(houseInformationApi)
    ) {
      return null
    }

    const match = houseInformationApi.getAttribute('match')
    const noMatch = houseInformationApi.getAttribute('noMatch')
    const error = houseInformationApi.getAttribute('error')

    const matchLinks = parseLinks(match || '')
    const noMatchLinks = parseLinks(noMatch || '')
    const errorLinks = parseLinks(error || '')

    return {
      __typename: 'EmbarkApiHouseInformation',
      component: 'HouseInformationApi',
      data: {
        match: matchLinks && matchLinks[0],
        noMatch: noMatchLinks && noMatchLinks[0],
        error: errorLinks && errorLinks[0],
      },
    }
  }

  const createQuoteApi = element.getElementsByTagName('createquoteapi')[0]

  if (createQuoteApi) {
    if (
      !allowNestedChildren &&
      !getFirstLevelNodes(element).includes(createQuoteApi)
    ) {
      return null
    }

    const uwlimits = createQuoteApi.getAttribute('uwlimits')
    const success = createQuoteApi.getAttribute('success')
    const error = createQuoteApi.getAttribute('error')

    const uwlimitsLinks = parseLinks(uwlimits || '')
    const successLinks = parseLinks(success || '')
    const errorLinks = parseLinks(error || '')

    return {
      __typename: 'EmbarkApiCreateQuote',
      component: 'CreateQuoteApi',
      data: {
        uwlimits: uwlimitsLinks && uwlimitsLinks[0],
        success: successLinks && successLinks[0],
        error: errorLinks && errorLinks[0],
      },
    }
  }

  return null
}

const isJson = (str: string) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const parseTracks = (element: Element) => {
  const trackElements = Array.from(element.getElementsByTagName('track'))

  return trackElements
    .map((trackElement) => {
      const eventName = trackElement.getAttribute('name')
      const eventKeys = trackElement.getAttribute('keys') || ''
      const includeAllKeys = trackElement.getAttribute('includeAllKeys')
      const customData = trackElement.getAttribute('customData')
        ? trackElement.getAttribute('customData')!.replace(/'/g, '"')
        : null

      if (!eventName) {
        return null
      }

      if (customData) {
        if (!isJson(customData)) {
          throw new Error('customData must be valid JSON.')
        }
      }

      return {
        __typename: 'EmbarkTrack',
        eventName,
        eventKeys: eventKeys
          .replace(/^\[/g, '')
          .replace(/\]$/g, '')
          .split(',')
          .filter((key) => key),
        includeAllKeys: !!includeAllKeys,
        customData: customData,
      }
    })
    .filter((track) => !!track)
}

export const parseStoryData = (storyData: any, textKeyMap: TextKeyObject) => {
  const translate: Translator = (text: string) =>
    resolvePlaceholders(text, textKeyMap)
  const parsePossibleExpressionContent = createParsePossibleExpressionContent(
    translate,
  )

  return {
    id: storyData.id,
    name: storyData.name,
    startPassage: storyData.startPassage,
    keywords: storyData.keywords || {},
    partnerConfigs: storyData.partnerConfigs || [],
    computedValues: storyData.computedValues as
      | ReadonlyArray<{ key: string; value: string }>
      | undefined,
    passages: storyData.passages.map((passage: any) => {
      const containerElement = document.createElement('div')
      containerElement.innerHTML = passage.text

      const api = parseApi(containerElement, false)
      const tracks = parseTracks(containerElement)

      const messages = Array.from(
        containerElement.getElementsByTagName('message'),
      ).map((message) => parsePossibleExpressionContent(message))

      const redirects = Array.from(
        containerElement.getElementsByTagName('redirect'),
      )
        .map((redirect) => {
          const whenAttribute = redirect.getAttribute('when')
          const toAttribute = redirect.getAttribute('to')
          const keyAttribute = redirect.getAttribute('key')
          const valueAttribute = redirect.getAttribute('value')
          const links = parseLinks(toAttribute || '')

          const expression = parseExpression(whenAttribute || '')

          if (!expression || !links) {
            return null
          }

          if (expression.__typename === 'EmbarkExpressionUnary') {
            return {
              ...expression,
              __typename: 'EmbarkRedirectUnaryExpression',
              to: links[0].name,
              passedExpressionKey: keyAttribute,
              passedExpressionValue: valueAttribute,
            }
          }

          if (expression.__typename === 'EmbarkExpressionBinary') {
            return {
              ...expression,
              __typename: 'EmbarkRedirectBinaryExpression',
              to: links[0].name,
              passedExpressionKey: keyAttribute,
              passedExpressionValue: valueAttribute,
            }
          }

          return {
            ...expression,
            __typename: 'EmbarkRedirectMultipleExpressions',
            to: links[0].name,
            passedExpressionKey: keyAttribute,
            passedExpressionValue: valueAttribute,
          }
        })
        .filter((item) => item)

      const externalRedirect = parseExternalRedirect(containerElement)

      return {
        id: passage.id,
        text: passage.text,
        name: passage.name,
        url: passage.url,
        allLinks: parseLinks(translate(passage.text)) || [],
        api: api || null,
        tracks: [
          ...tracks,
          {
            __typename: 'EmbarkTrack',
            eventName: `Passage Shown - ${passage.name}`,
            eventKeys: [],
            includeAllKeys: true,
            customData: null,
          },
        ],
        messages,
        redirects,
        externalRedirect,
        action: getAction(containerElement, translate),
        response: getResponse(
          passage.name,
          containerElement,
          parsePossibleExpressionContent,
        ),
        tooltips: Array.from(
          containerElement.getElementsByTagName('Tooltip'),
        ).map(parseTooltip(translate)),
      }
    }),
  }
}
