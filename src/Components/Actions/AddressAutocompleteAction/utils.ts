import {
  AddressSuggestion,
  CompleteAddress,
} from '../../API/addressAutocomplete'

export const formatAddressLine = (address: AddressSuggestion): string => {
  if (address.streetName && address.streetNumber) {
    let displayAddress = `${address.streetName} ${address.streetNumber}`
    if (address.floor) {
      displayAddress += `, ${address.floor}.`
    }
    if (address.apartment) {
      displayAddress += ` ${address.apartment}`
    }
    return displayAddress
  }

  return address.address
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
  return MANDATORY_ADDRESS_FIELDS.every((key) => suggestion[key] !== undefined)
}

export const isSameAddress = (
  first: AddressSuggestion,
  second: AddressSuggestion,
) => {
  const { id: _, ...firstFields } = first
  const { id: __, ...secondFields } = second
  return JSON.stringify(firstFields) === JSON.stringify(secondFields)
}
