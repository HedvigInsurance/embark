import { AddressAutocompleteData } from '../../API/addressAutocomplete'

export const isMatchingStreetName = (
  searchTerm: string,
  option?: AddressAutocompleteData,
) => {
  return option?.streetName && searchTerm.startsWith(option.streetName)
}
