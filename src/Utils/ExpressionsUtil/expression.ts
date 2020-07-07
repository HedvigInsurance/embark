import { Store } from '../../Components/KeyValueStore'

export type ExpressionType =
  | 'AND'
  | 'OR'
  | 'EQUALS'
  | 'MORE_THAN'
  | 'MORE_THAN_OR_EQUALS'
  | 'LESS_THAN'
  | 'LESS_THAN_OR_EQUALS'
  | 'NOT_EQUALS'
  | 'ALWAYS'

export interface Expression {
  type: ExpressionType
  key: any
  value: any
  text: string
  subExpressions?: Expression[]
}

export const passes = (store: Store, expression: Expression): boolean => {
  if (expression.type === 'AND') {
    return !expression
      .subExpressions!.map((exp) => passes(store, exp))
      .includes(false)
  }

  if (expression.type === 'OR') {
    return expression
      .subExpressions!.map((exp) => passes(store, exp))
      .includes(true)
  }

  if (expression.type == 'EQUALS') {
    return store[expression.key] == expression.value
  }

  if (expression.type == 'MORE_THAN') {
    return Number(store[expression.key]) > Number(expression.value)
  }

  if (expression.type == 'MORE_THAN_OR_EQUALS') {
    return Number(store[expression.key]) >= Number(expression.value)
  }

  if (expression.type == 'LESS_THAN') {
    return Number(store[expression.key]) < Number(expression.value)
  }

  if (expression.type == 'LESS_THAN_OR_EQUALS') {
    return Number(store[expression.key]) <= Number(expression.value)
  }

  if (expression.type == 'NOT_EQUALS') {
    return store[expression.key] != expression.value
  }

  if (expression.type == 'ALWAYS') {
    return true
  }

  return false
}
