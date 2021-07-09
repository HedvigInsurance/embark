import * as React from 'react'
import {
  AddressSuggestion,
  CompleteAddress,
} from '../../API/addressAutocomplete'
import { Store, StoreContext } from '../../KeyValueStore'
import { formatAddressLine, isCompleteAddress } from './utils'

const ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND'

const STORE_KEY = {
  ID: 'bbrId',
  ADDRESS: 'fullAddress',
  STREET: 'street',
  STREET_NAME: 'streetName',
  STREET_NUMBER: 'streetNumber',
  ZIP_CODE: 'zipCode',
  CITY: 'city',
  FLOOR: 'floor',
  APARTMENT: 'apartment',
  ADDRESS_SEARCH_TERM: 'addressSearchTerm',
}

const getAddressFromStore = (store: Store): CompleteAddress | null => {
  const data: AddressSuggestion = {
    id: store[STORE_KEY.ID],
    address: store[STORE_KEY.ADDRESS],
    streetName: store[STORE_KEY.STREET_NAME],
    streetNumber: store[STORE_KEY.STREET_NUMBER],
    floor: store[STORE_KEY.FLOOR],
    apartment: store[STORE_KEY.APARTMENT],
    postalCode: store[STORE_KEY.ZIP_CODE],
    city: store[STORE_KEY.CITY],
  }

  return isCompleteAddress(data) ? data : null
}

const collectAddressSubmission = (address: CompleteAddress) => {
  const data = {
    [STORE_KEY.ID]: address.id,
    [STORE_KEY.STREET]: `${address.streetName} ${address.streetNumber}`,
    [STORE_KEY.ZIP_CODE]: address.postalCode,
    [STORE_KEY.CITY]: address.city,
    [STORE_KEY.STREET_NAME]: address.streetName,
    [STORE_KEY.STREET_NUMBER]: address.streetNumber,

    [STORE_KEY.ADDRESS]: address.address,
  }

  if (address.floor) {
    data[STORE_KEY.FLOOR] = address.floor
  }

  if (address.apartment) {
    data[STORE_KEY.APARTMENT] = address.apartment
  }

  return data
}

interface Props {
  storeKey: string
  passageName: string
}

const useStoreAddress = ({ storeKey, passageName }: Props) => {
  const { store, setValue, removeValues } = React.useContext(StoreContext)

  const initialAddress = React.useMemo(() => getAddressFromStore(store), [])

  const clearStoreValues = React.useCallback(
    () =>
      Object.values(STORE_KEY).forEach((storeKey) => {
        removeValues(storeKey)
      }),
    [removeValues],
  )

  const saveAddress = React.useCallback(
    (address: CompleteAddress) => {
      clearStoreValues()

      Object.entries(collectAddressSubmission(address)).forEach(
        ([key, value]) => {
          setValue(key, value)
        },
      )

      const addressLine = formatAddressLine(address)
      setValue(storeKey, addressLine)
      setValue(`${passageName}Result`, addressLine)
    },
    [clearStoreValues, setValue, storeKey, passageName],
  )

  const saveNotFound = React.useCallback(
    (searchTerm: string) => {
      clearStoreValues()

      setValue(STORE_KEY.ADDRESS_SEARCH_TERM, searchTerm)
      setValue(storeKey, ADDRESS_NOT_FOUND)
    },
    [clearStoreValues, setValue, storeKey],
  )

  return { initialAddress, saveAddress, saveNotFound }
}

export default useStoreAddress
