import { passes, Expression } from './expression'

describe('ExpressionType.OR', () => {
  it('handles example 1 correctly', () => {
    const expression: Expression = {
      type: 'OR',
      key: '_',
      value: '_',
      text: '_',
      subExpressions: [
        {
          type: 'OR',
          key: '_',
          value: '_',
          text: '_',
          subExpressions: [
            {
              type: 'MORE_THAN_OR_EQUALS',
              key: 'personalNumber.Age',
              value: '30',
              text: '_',
            },
            {
              type: 'MORE_THAN_OR_EQUALS',
              key: 'livingSpace',
              value: '50',
              text: '_',
            },
          ],
        },
        {
          type: 'MORE_THAN_OR_EQUALS',
          key: 'householdSize',
          value: '2',
          text: '_',
        },
      ],
    }
    const mockStore = {
      'personalNumber.Age': '30',
      livingSpace: '53',
      householdSize: '2',
    }

    expect(passes(mockStore, expression)).toBeTruthy()
  })
})
