import {
  AddressSuggestion,
  AddressAutocompleteType,
} from '../../API/addressAutocomplete'
import * as React from 'react'
import { ApiContext } from '../../API/ApiContext'
import { isMatchingStreetName } from './utils'
import useDebounce from './useDebounce'

const getApiQuery = (
  searchTerm: string,
  suggestion?: AddressSuggestion,
): [string, AddressAutocompleteType] => {
  if (suggestion) {
    if (!suggestion.city) {
      // Refine search after selecting a suggested street name
      return [searchTerm, 'BUILDING']
    }

    if (
      suggestion.city &&
      suggestion.postalCode &&
      isMatchingStreetName(searchTerm, suggestion)
    ) {
      // Refine search after selecting a specific building (floor & apartment)
      return [
        `${searchTerm}, , ${suggestion.postalCode} ${suggestion.city}`,
        'APARTMENT',
      ]
    }
  }

  return [searchTerm, 'STREET']
}

const useAddressSearch = (
  searchTerm: string = '',
  suggestion?: AddressSuggestion,
): [
  AddressSuggestion[] | null,
  React.Dispatch<React.SetStateAction<AddressSuggestion[] | null>>,
] => {
  const api = React.useContext(ApiContext)
  const [suggestions, setSuggestions] = React.useState<
    AddressSuggestion[] | null
  >(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [apiQuery, suggestionType] = getApiQuery(
    debouncedSearchTerm,
    suggestion,
  )

  // @ts-ignore: clean-up function only needed conditionally
  React.useEffect(() => {
    if (apiQuery.trim() !== '') {
      let isFresh = true
      api
        .addressAutocompleteQuery(apiQuery, { type: suggestionType })
        .then((newOptions) => {
          if (isFresh) {
            setSuggestions(newOptions)
          }
        })

      return () => {
        isFresh = false
      }
    } else {
      setSuggestions(null)
    }
  }, [apiQuery, suggestionType])

  return [suggestions, setSuggestions]
}

export default useAddressSearch
