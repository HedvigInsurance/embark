import {
  ComputedStoreValues,
  createStoreWithComputedValues,
  Store,
} from './KeyValueStore'

it('creates a store with computed properties', () => {
  const store: Store = { prop1: '1', prop2: '41' }
  const computedStoreValues: ComputedStoreValues = {
    meaningOfLife: 'prop1 + prop2',
    doubleMeaningOfLife: 'meaningOfLife + 42',
  }
  const fullStore = createStoreWithComputedValues(store, computedStoreValues)

  expect(fullStore.prop1).toBe('1')
  expect(fullStore.prop2).toBe('41')
  expect(fullStore.meaningOfLife).toBe('42')
  expect(fullStore.doubleMeaningOfLife).toBe('84')
})
