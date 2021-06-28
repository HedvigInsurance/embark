import {
  AddressSuggestion,
  CompleteAddress,
} from '../../API/addressAutocomplete'

export const formatAddressLine = (suggestion: AddressSuggestion): string => {
  if (
    suggestion.city &&
    suggestion.postalCode &&
    suggestion.streetName &&
    suggestion.streetNumber
  ) {
    return suggestion.address
      .replace(suggestion.city, '')
      .replace(suggestion.postalCode, '')
      .replace(/,\s*$/, '')
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
  address: AddressSuggestion,
): [string, string | undefined] => {
  return [formatAddressLine(address), formatPostalLine(address)]
}

export const isMatchingStreetName = (
  searchTerm: string,
  suggestion?: AddressSuggestion,
) => {
  if (suggestion) {
    return searchTerm.startsWith(formatAddressLine(suggestion))
  }
  return false
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
