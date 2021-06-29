export interface AddressSuggestion {
  id?: string
  address: string
  streetName?: string
  streetNumber?: string
  floor?: string
  apartment?: string
  postalCode?: string
  city?: string
}

export type CompleteAddress = AddressSuggestion & {
  id: string
  address: string
  streetName: string
  streetNumber: string
  postalCode: string
  city: string
}

export type AddressAutocompleteType = 'STREET' | 'BUILDING' | 'APARTMENT'

export type AddressAutocompleteQuery = (
  searchTerm: string,
  options?: { type: AddressAutocompleteType },
) => Promise<AddressSuggestion[]>
