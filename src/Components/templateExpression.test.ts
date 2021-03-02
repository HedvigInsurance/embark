import { evaluateTemplateExpression } from './templateExpression'

it('substitutes a number', () => {
  const expression = '42'
  expect(evaluateTemplateExpression(expression, {})).toBe('42')
})

it('says two numbers are invalid', () => {
  const expression = '42 1337'
  expect(evaluateTemplateExpression(expression, {})).toBe(
    'Unexpected number constant "1337"',
  )
})

it('calculates two integers', () => {
  const expression = '41+1'
  expect(evaluateTemplateExpression(expression, {})).toBe('42')

  const expressionWithSpaces = '41 + 1'
  expect(evaluateTemplateExpression(expressionWithSpaces, {})).toBe('42')
})

it('calculates many integers with plus and minus', () => {
  const expression = '1 +2 + 3 -1 '
  expect(evaluateTemplateExpression(expression, {})).toBe('5')
})

it('calculates two floats', () => {
  const expression = '13.17 + 0.2'
  expect(evaluateTemplateExpression(expression, {})).toBe('13.37')
})

it('calculates a float and an int', () => {
  const expression = '13 + 0.37'
  expect(evaluateTemplateExpression(expression, {})).toBe('13.37')
})

it('calculates an even float and int to be an int', () => {
  const expression = '1337 + 1.0'
  expect(evaluateTemplateExpression(expression, {})).toBe('1338')
})

it('concats two "number" strings', () => {
  const expression = '"133" ++ \'7\''
  expect(evaluateTemplateExpression(expression, {})).toBe('1337')
})

it('references store', () => {
  const expression = 'myKey'
  expect(evaluateTemplateExpression(expression, { myKey: 'my value' })).toBe(
    'my value',
  )
})

it('calculates with store reference', () => {
  const expression = 'myKey + 1'
  expect(evaluateTemplateExpression(expression, { myKey: '41' })).toBe('42')
})

it('string concats with store reference', () => {
  const expression = '"foo" ++ " "++ myKey ++ \' \'++"baz"'
  expect(evaluateTemplateExpression(expression, { myKey: 'bar' })).toBe(
    'foo bar baz',
  )
})

it('fails when using multiple operators in a row', () => {
  const expression = '"foo" ++ ++ "bar"'
  expect(evaluateTemplateExpression(expression, {})).toBe(
    'Invalid use of operator "++", must have expressions on both sides',
  )
})
