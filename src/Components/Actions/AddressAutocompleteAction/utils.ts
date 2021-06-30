import {
  AddressSuggestion,
  CompleteAddress,
} from '../../API/addressAutocomplete'

export const formatAddressLine = ({
  streetName,
  streetNumber,
  floor,
  apartment,
  address,
}: AddressSuggestion): string => {
  if (streetName && streetNumber) {
    let displayAddress = `${streetName} ${streetNumber}`
    if (floor) {
      displayAddress += `, ${floor}.`
    }
    if (apartment) {
      displayAddress += ` ${apartment}`
    }
    return displayAddress
  }

  return address
}

export const formatPostalLine = ({
  city,
  postalCode,
}: AddressSuggestion): string | undefined => {
  if (city && postalCode) {
    return `${postalCode} ${city}`
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
