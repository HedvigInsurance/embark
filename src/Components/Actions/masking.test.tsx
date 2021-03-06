import {
  derivedValues,
  isValid,
  mapMaskedValue,
  mapUnmaskedValue,
  unmaskValue,
} from './masking'
import { differenceInYears, parse } from 'date-fns'

describe('isValid', () => {
  it('validates PersonalNumber mask', () => {
    const validPersonalNumber = '120130-1212'
    expect(isValid('PersonalNumber', validPersonalNumber)).toBe(true)
    const invalidPersonalNumber = 'not a valid personal number'
    expect(isValid('PersonalNumber', invalidPersonalNumber)).toBe(false)
  })

  it('validates PostalCode mask', () => {
    const validPostalCode = '12345'
    expect(isValid('PostalCode', validPostalCode)).toBe(true)
    const invalidPostalCode = 'not a valid postal code'
    expect(isValid('PostalCode', invalidPostalCode)).toBe(false)
  })

  it('validates NorwegianPostalCode mask', () => {
    const validPostalCode = '1234'
    expect(isValid('NorwegianPostalCode', validPostalCode)).toBe(true)
    const invalidPostalCode = 'not a valid postal code'
    expect(isValid('NorwegianPostalCode', invalidPostalCode)).toBe(false)
  })

  it('validates email mask', () => {
    const validEmail = 'my@mail.here'
    expect(isValid('Email', validEmail)).toBe(true)
    const invalidEmail = 'not a valid email'
    expect(isValid('Email', invalidEmail)).toBe(false)
  })

  it('validates BirthDate mask', () => {
    const validBirthDate = '1912-01-30'
    expect(isValid('BirthDate', validBirthDate)).toBe(true)
    const invalidBirthDate = 'not a valid birth date'
    expect(isValid('BirthDate', invalidBirthDate)).toBe(false)
  })

  it('validates BirthDateReverse mask', () => {
    const validBirthDate = '30-01-1912'
    expect(isValid('BirthDateReverse', validBirthDate)).toBe(true)
    const invalidBirthDate = 'not a valid birth date'
    expect(isValid('BirthDateReverse', invalidBirthDate)).toBe(false)
  })

  it('validates no mask', () => {
    expect(isValid(undefined, 'anything')).toBe(true)
  })
})

describe('unmaskValue', () => {
  it('just returns on no mask', () => {
    expect(unmaskValue('blah', undefined)).toBe('blah')
  })

  it('removes dash on PersonalNumber mask', () => {
    expect(unmaskValue('120130-1212', 'PersonalNumber')).toBe('1201301212')
  })

  it('removes spaces on PostalCode mask', () => {
    expect(unmaskValue('123 45', 'PostalCode')).toBe('12345')
  })

  it('just returns on other masks', () => {
    expect(unmaskValue('1234', 'NorwegianPostalCode')).toBe('1234')
    expect(unmaskValue('1923-01-30', 'BirthDate')).toBe('1923-01-30')
    expect(unmaskValue('30-01-1923', 'BirthDateReverse')).toBe('30-01-1923')
  })
})

describe('mapUnmaskedValue', () => {
  it('maps BirthDateReverse mask from reverse iso date to iso date', () => {
    expect(mapUnmaskedValue('30-01-1912', 'BirthDateReverse')).toBe(
      '1912-01-30',
    )
  })

  it("doesn't map invalid reverse birth date", () => {
    expect(mapUnmaskedValue('1234567', 'BirthDateReverse')).toBe('1234567')
  })

  it("doesn't map other masks", () => {
    expect(mapUnmaskedValue('1912-01-30', 'BirthDate')).toBe('1912-01-30')
  })
})

describe('mapMaskedValue', () => {
  it('maps BirthDateReverse mask from iso date to reverse iso date', () => {
    expect(mapMaskedValue('1912-01-30', 'BirthDateReverse')).toBe('30-01-1912')
  })

  it("doesn't map invalid birth date", () => {
    expect(mapUnmaskedValue('1234567', 'BirthDateReverse')).toBe('1234567')
  })

  it("doesn't map other masks", () => {
    expect(mapUnmaskedValue('1912-01-30', 'BirthDate')).toBe('1912-01-30')
  })
})

describe('derivedValues', () => {
  it('gets age from personal number', () => {
    expect(derivedValues('PersonalNumber', 'bla', '010203-1212')).toEqual({
      'bla.Age': differenceInYears(
        new Date(),
        parse('2001-02-03', 'yyyy-MM-dd', 0),
      ),
    })
  })

  it('gets age from BirthDate', () => {
    expect(derivedValues('BirthDate', 'bla', '2001-02-03')).toEqual({
      'bla.Age': differenceInYears(
        new Date(),
        parse('2001-02-03', 'yyyy-MM-dd', 0),
      ),
    })
    expect(derivedValues('BirthDateReverse', 'bla', '2001-02-03')).toEqual({
      'bla.Age': differenceInYears(
        new Date(),
        parse('2001-02-03', 'yyyy-MM-dd', 0),
      ),
    })
  })

  it('gets nothing on other masks', () => {
    expect(derivedValues('PostalCode', 'bla', '1234')).toBe(null)
  })
})
