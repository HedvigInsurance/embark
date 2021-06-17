import { AddressSuggestion } from '../../API/addressAutocomplete'

export const isMatchingStreetName = (
  searchTerm: string,
  suggestion?: AddressSuggestion,
) => {
  return suggestion?.streetName && searchTerm.startsWith(suggestion.streetName)
}

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
