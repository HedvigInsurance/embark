import { AddressSuggestion } from '../../API/addressAutocomplete'
import * as React from 'react'
import { ApiContext } from '../../API/ApiContext'
import { isMatchingStreetName } from './utils'
import useDebounce from './useDebounce'

const getApiQuery = (searchTerm: string, suggestion?: AddressSuggestion) => {
  if (suggestion) {
    if (suggestion.city === undefined) {
      // Refine search after selecting a suggested street name
      return searchTerm + ' '
    }

    if (suggestion.postalCode && isMatchingStreetName(searchTerm, suggestion)) {
      // Refine search after selecting a specific building (floor & apartment)
      return `${searchTerm} ${suggestion.postalCode} ${suggestion.city}`
    }
  }

  return searchTerm
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
  const apiQuery = React.useMemo(
    () => getApiQuery(debouncedSearchTerm, suggestion),
    [debouncedSearchTerm, suggestion],
  )

  // @ts-ignore: clean-up function only needed conditionally
  React.useEffect(() => {
    if (apiQuery.trim() !== '') {
      let isFresh = true
      api.addressAutocompleteQuery(apiQuery).then((newOptions) => {
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
  }, [apiQuery])

  return [suggestions, setSuggestions]
}

export default useAddressSearch
