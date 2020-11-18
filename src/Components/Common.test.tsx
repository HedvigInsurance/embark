import { evalTemplateString } from './Common'

describe('evalTemplateString', () => {
  it('evaluates template', () => {
    const template = "hi, {name}! I'm {age + 1} in 1 year"
    const result = evalTemplateString(template, { name: 'blarg', age: '41' })
    expect(result).toBe("hi, blarg! I'm 42 in 1 year")
  })
})
