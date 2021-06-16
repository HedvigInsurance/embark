export interface AddressAutocompleteData {
  id?: string
  address: string
  streetName?: string
  streetNumber?: string
  floor?: string
  apartment?: string
  postalCode?: string
  city?: string
}

export type CompleteAddressData = AddressAutocompleteData & {
  id: string
  address: string
  streetName: string
  streetNumber: string
  postalCode: string
  city: string
}

const MANDATORY_ADDRESS_FIELDS: Array<keyof AddressAutocompleteData> = [
  'id',
  'address',
  'streetName',
  'streetNumber',
  'postalCode',
  'city',
]

export const isCompleteAddressData = (
  data: Record<string, any>,
): data is CompleteAddressData => {
  return MANDATORY_ADDRESS_FIELDS.every((key) => data[key] !== undefined)
}
