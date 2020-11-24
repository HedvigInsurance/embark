import { Store } from './KeyValueStore'

type TokenType =
  | 'void'
  | 'binaryOperator'
  | 'storeKey'
  | 'stringConstant'
  | 'numberConstant'
type Token = {
  type: TokenType
  payload: string
}

type BinaryOperatorExpression = {
  type: 'binaryOperator'
  left?: Expression
  right?: Expression
  operator: string
}
type StringConstantExpression = {
  type: 'stringConstant'
  constant: string
}
type NumberConstantExpression = {
  type: 'numberConstant'
  constant: number
}
type StoreKeyExpression = {
  type: 'storeKey'
  key: string
}
type Expression =
  | BinaryOperatorExpression
  | StringConstantExpression
  | NumberConstantExpression
  | StoreKeyExpression

export const evaluateTemplateExpression = (
  expressionString: string,
  store: Store,
): string => {
  try {
    const tokenStream = parseTokenStream(expressionString)
    const abstractExpression = parseAbstractExpression(tokenStream)

    if (!abstractExpression) {
      return `Empty expression`
    }

    return evaluateAbstractExpression(abstractExpression, store)
  } catch (e) {
    return String(e)
  }
}

const expressionRegex = '[\\s\\wd\'"-+]+'
export const getExpressionRegex = () => RegExp(`(${expressionRegex})`, 'i')
export const getTemplateExpressionRegex = () =>
  RegExp(`({${expressionRegex}})`, 'i')

const VOID_EXPR = /^\s+/
const BIN_OPERATOR_EXPR = /^(-|\+\+|\+)/
const STORE_KEY_EXPR = /^([a-zA-Z][\w\d]*)/i
const NUMBER_CONSTANT_EXPR = /^(\d+(\.\d+)?)/
const DOUBLE_QUOTE_STRING_CONSTANT_EXPR = /^"([^"]*)"/
const SINGLE_QUOTE_STRING_CONSTANT_EXPR = /^'([^']*)'/
const tokenCheckers: ReadonlyArray<[TokenType, RegExp]> = [
  ['binaryOperator', BIN_OPERATOR_EXPR],
  ['storeKey', STORE_KEY_EXPR],
  ['numberConstant', NUMBER_CONSTANT_EXPR],
  ['stringConstant', DOUBLE_QUOTE_STRING_CONSTANT_EXPR],
  ['stringConstant', SINGLE_QUOTE_STRING_CONSTANT_EXPR],
]
const parseTokenStream = (expressionString: string): Token[] => {
  let cursor = 0

  const tokenStream: Token[] = []
  while (cursor < expressionString.length) {
    const subExpr = expressionString.substring(cursor, expressionString.length)
    if (VOID_EXPR.test(subExpr)) {
      // ignore this part
      cursor += subExpr.match(VOID_EXPR)![0].length
      continue
    }

    const matchingTokenChecker = tokenCheckers.find(([, regex]) =>
      regex.test(subExpr),
    )

    if (!matchingTokenChecker) {
      throw `Invalid expression from "${subExpr}"`
    }

    const [tokenType, tokenRegex] = matchingTokenChecker
    const matches = subExpr.match(tokenRegex)!
    tokenStream.push({
      type: tokenType,
      payload: matches[1],
    })
    cursor += matches[0].length
  }

  return tokenStream
}

const parseAbstractExpression = (
  tokenStream: ReadonlyArray<Token>,
): Expression | null => {
  let tokenStreamCursor = 0
  let abstractExpression: Expression | null = null

  while (tokenStreamCursor < tokenStream.length) {
    const token = tokenStream[tokenStreamCursor]

    switch (token.type) {
      case 'binaryOperator': {
        if (!abstractExpression) {
          throw `Unexpected token operator "${token.payload}"`
        }
        abstractExpression = {
          type: 'binaryOperator',
          operator: token.payload,
          left: abstractExpression!,
        }
        break
      }

      case 'storeKey': {
        const storeKeyExpression: StoreKeyExpression = {
          type: 'storeKey',
          key: token.payload,
        }
        if (abstractExpression) {
          if (abstractExpression.type === 'binaryOperator') {
            abstractExpression = {
              ...abstractExpression!,
              right: storeKeyExpression,
            }
            break
          }
          throw `Unexpected token ${token.payload}`
        }

        abstractExpression = storeKeyExpression
        break
      }

      case 'numberConstant': {
        const numberExpression: NumberConstantExpression = {
          type: 'numberConstant',
          constant: Number(token.payload),
        }

        if (abstractExpression) {
          if (abstractExpression.type === 'binaryOperator') {
            abstractExpression = {
              ...abstractExpression!,
              right: numberExpression,
            }
            break
          }

          throw `Unexpected number constant "${token.payload}"`
        }

        abstractExpression = numberExpression
        break
      }

      case 'stringConstant': {
        const stringExpression: StringConstantExpression = {
          type: 'stringConstant',
          constant: token.payload,
        }
        if (abstractExpression) {
          if (abstractExpression.type === 'binaryOperator') {
            abstractExpression = {
              ...abstractExpression!,
              right: stringExpression,
            }
            break
          }
          throw `Unexpected string constant "${token.payload}"`
        }

        abstractExpression = stringExpression
        break
      }

      default:
        throw `Unexpected token "${token.payload}"`
    }

    tokenStreamCursor += 1
  }

  return abstractExpression
}

export const evaluateAbstractExpression = (
  expression: Expression,
  store: Store,
): string => {
  switch (expression.type) {
    case 'storeKey':
      return String(store[expression.key] || '')
    case 'numberConstant':
      return String(expression.constant)
    case 'stringConstant':
      return expression.constant
    case 'binaryOperator':
      if (!expression.left || !expression.right) {
        throw `Invalid use of operator "${expression.operator}", must have expressions on both sides`
      }
      switch (expression.operator) {
        case '+':
          return String(
            Number(evaluateAbstractExpression(expression.left!, store)) +
              Number(evaluateAbstractExpression(expression.right!, store)),
          )
        case '-':
          return String(
            Number(evaluateAbstractExpression(expression.left!, store)) -
              Number(evaluateAbstractExpression(expression.right!, store)),
          )
        case '++':
          return (
            evaluateAbstractExpression(expression.left!, store) +
            evaluateAbstractExpression(expression.right!, store)
          )
        default:
          throw `Invalid operator "${expression.operator}"`
      }
  }
}
