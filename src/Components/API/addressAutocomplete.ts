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
