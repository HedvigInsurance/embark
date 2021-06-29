import {
  AddressSuggestion,
  CompleteAddress,
} from '../../API/addressAutocomplete'

export const formatAddressLine = (suggestion: AddressSuggestion): string => {
  if (suggestion.streetName && suggestion.streetNumber) {
    let displayAddress = `${suggestion.streetName} ${suggestion.streetNumber}`
    if (suggestion.floor) {
      displayAddress += `, ${suggestion.floor}.`
    }
    if (suggestion.apartment) {
      displayAddress += ` ${suggestion.apartment}`
    }
    return displayAddress
  }

  return suggestion.address
}

export const formatPostalLine = (
  address: AddressSuggestion,
): string | undefined => {
  if (address.city && address.postalCode) {
    return `${address.postalCode} ${address.city}`
  }

  return undefined
}

export const formatAddressLines = (
  suggestion: AddressSuggestion,
): [string, string | undefined] => {
  return [formatAddressLine(suggestion), formatPostalLine(suggestion)]
}

export const isMatchingStreetName = (
  searchTerm: string,
  suggestion?: AddressSuggestion,
) => {
  return suggestion?.streetName && searchTerm.startsWith(suggestion.streetName)
}

const MANDATORY_ADDRESS_FIELDS: Array<keyof AddressSuggestion> = [
  'id',
  'address',
  'streetName',
  'streetNumber',
  'postalCode',
  'city',
]

export const isCompleteAddress = (
  suggestion: AddressSuggestion,
): suggestion is CompleteAddress => {
  return MANDATORY_ADDRESS_FIELDS.every((key) => suggestion[key])
}

export const isSameAddress = (
  first: AddressSuggestion,
  second: AddressSuggestion,
) => {
  const { id: _, ...firstFields } = first
  const { id: __, ...secondFields } = second
  return JSON.stringify(firstFields) === JSON.stringify(secondFields)
}
