import { replacePlaceholders } from './Common'
import { Store } from './KeyValueStore'

it('replace placeholders with string', () => {
  const store: Store = { firstName: 'John', lastName: 'Doe' }
  const text = 'Your name is {firstName} {lastName}'
  const resolvedText = replacePlaceholders(store, text)
  expect(resolvedText).toBe('Your name is John Doe')
})

it('replace placeholders with number', () => {
  const store: Store = { livingSpace: '42', firstName: 'John', lastName: 'Doe' }
  const text = '{livingSpace} square meters'
  const resolvedText = replacePlaceholders(store, text)
  expect(resolvedText).toBe('42 square meters')
})
