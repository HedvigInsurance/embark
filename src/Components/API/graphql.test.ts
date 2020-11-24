import { parseSingleVariable } from './graphql'

describe('parseSingleVariable()', () => {
  it('should return correct parsed value', () => {
    const streetVariable = {
      __typename: 'EmbarkAPIGraphQLSingleVariable',
      key: 'street',
      from: 'streetAddress',
      as: 'string',
    }

    const areaVariable = {
      __typename: 'EmbarkAPIGraphQLSingleVariable',
      key: 'area',
      from: 'area',
      as: 'int',
    }

    const ssnVariable = {
      __typename: 'EmbarkAPIGraphQLSingleVariable',
      key: 'ssn',
      from: 'personalNumber',
      as: 'string',
    }

    const hasWaterVariable = {
      __typename: 'EmbarkAPIGraphQLSingleVariable',
      key: 'hasWaterConnected',
      from: 'hasWaterConnected',
      as: 'boolean',
    }

    const isSubletedVariable = {
      __typename: 'EmbarkAPIGraphQLSingleVariable',
      key: 'isSubleted',
      from: 'isSubleted',
      as: 'boolean',
    }

    const streetAddress = { streetAddress: 'Hello World' }
    const ssn = { personalNumber: '8908034753' }
    const isSubleted = { isSubleted: 'false' }
    const extraBuilding = {
      area: '23',
      hasWaterConnected: 'true',
      type: 'ATTEFALL',
    }

    expect(parseSingleVariable(streetVariable, streetAddress)).toMatch(
      'Hello World',
    )
    expect(parseSingleVariable(ssnVariable, ssn)).toMatch('8908034753')
    expect(parseSingleVariable(isSubletedVariable, isSubleted)).toBe(false)
    expect(parseSingleVariable(areaVariable, extraBuilding)).toBe(23)
    expect(parseSingleVariable(hasWaterVariable, extraBuilding)).toBe(true)
  })
})
