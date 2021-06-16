import { AddressSuggestion } from '../../API/addressAutocomplete'

export const isMatchingStreetName = (
  searchTerm: string,
  suggestion?: AddressSuggestion,
) => {
  return suggestion?.streetName && searchTerm.startsWith(suggestion.streetName)
}
