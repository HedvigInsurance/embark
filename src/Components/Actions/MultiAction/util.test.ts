import { getMultiActionItems } from './util'

describe('getMultiActionItems()', () => {
  it('should get correct items for example 1', () => {
    const store = {
      'extraBuildings[0]area': '5',
      'extraBuildings[0]type': 'OTHER',
      'extraBuildings[0]type.Label': 'Annan',
      'extraBuildings[0]hasWaterConnected': 'true',
    }

    const key = 'extraBuildings'

    expect(getMultiActionItems(store, key, false)).toMatchObject({
      '0': { area: '5', type: 'OTHER', hasWaterConnected: 'true' },
    })
  })
})
