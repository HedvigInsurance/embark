import { Data as PData } from './Components/API/personalInformation'
import { ApartmentType, Data as CQData } from './Components/API/createQuote'
import { Data as HData } from './Components/API/houseInformation'
import { AddressAutocompleteData } from './Components/API/addressAutocomplete'

const AN_UUID = '6955dd62-4994-4677-a174-7eab9a9a7b92'

export const personalInformationQueryMocks = [
  {
    request: {
      variables: {
        input: {
          personalNumber: '1212121212',
        },
      },
    },
    result: {
      data: {
        personalInformation: {
          firstName: 'Test',
          lastName: 'Testerson',
          streetAddress: 'Testvägen 1',
          city: 'Tensta',
          postalNumber: '12345',
        },
      } as PData,
    },
    delay: 2000,
  },
  {
    request: {
      variables: {
        input: {
          personalNumber: '1111111111',
        },
      },
    },
    result: {
      data: {
        personalInformation: null,
      } as PData,
    },
    delay: 2000,
  },
]

export const houseInformationMocks: [HData] = [
  {
    houseInformation: {
      livingSpace: 100,
      ancillaryArea: 20,
      yearOfConstruction: 2012,
    },
  },
]

export const createQuoteMocks = [
  {
    request: {
      variables: {
        input: {
          firstName: 'Test',
          lastName: 'Testerson',
          ssn: '1212121212',
          apartment: {
            street: 'Testvägen 1',
            zipCode: '12345',
            householdSize: 1,
            livingSpace: 50,
            type: 'BRF',
          },
        },
      },
    },
    result: {
      data: {
        createQuote: {
          id: AN_UUID,
          firstName: 'Test',
          lastName: 'Testerson',
          expiresAt: '2019-11-20T08:52:19.405Z',
          price: {
            amount: 100,
            currency: 'SEK',
          },
          details: {
            street: 'Testvägen 1',
            zipCode: '12345',
            householdSize: 1,
            livingSpace: 50,
            type: ApartmentType.BRF,
            __typename: 'CompleteApartmentQuoteDetails',
          },
          __typename: 'CompleteQuote',
        },
      } as CQData,
    },
  },
]

export const addressAutocompleteMocksStep1: AddressAutocompleteData[] = [
  {
    address: 'Fredrik Bajers Gade',
  },
  {
    address: 'Fredrik Bajers Plads',
  },
  {
    address: 'Fredrik Bajers Vej',
  },
]

export const addressAutocompleteMocksStep2: AddressAutocompleteData[] = [
  {
    id: '0a3f508f-9efe-32b8-e044-0003ba298018',
    address: 'Fredrik Bajers Gade 1, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '1',
    postalCode: '8700',
    city: 'Horsens',
  },
  {
    id: 'fee8fe3e-e991-408a-a708-630dcafc84d6',
    address: 'Fredrik Bajers Gade 1A, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '1A',
    postalCode: '8700',
    city: 'Horsens',
  },
  {
    id: '0a3f508f-9eff-32b8-e044-0003ba298018',
    address: 'Fredrik Bajers Gade 2, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '2',
    postalCode: '8700',
    city: 'Horsens',
  },
  {
    id: '0a3f508f-9f00-32b8-e044-0003ba298018',
    address: 'Fredrik Bajers Gade 3, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '3',
    postalCode: '8700',
    city: 'Horsens',
  },
  {
    id: '0a3f508f-9f01-32b8-e044-0003ba298018',
    address: 'Fredrik Bajers Gade 4, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '4',
    postalCode: '8700',
    city: 'Horsens',
  },
]

export const addressAutocompleteMocksStep3: AddressAutocompleteData[] = [
  {
    id: '6c720a4f-0862-4086-a160-9cac3f2b4a6c',
    address: 'Fredrik Bajers Gade 1, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '1',
    postalCode: '8700',
    city: 'Horsens',
  },
  {
    id: '0a3f50bb-521c-32b8-e044-0003ba298018',
    address: 'Fredrik Bajers Gade 1, st. tv, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '1',
    floor: 'st',
    apartment: 'tv',
    postalCode: '8700',
    city: 'Horsens',
  },
  {
    id: '0a3f50bb-521b-32b8-e044-0003ba298018',
    address: 'Fredrik Bajers Gade 1, st. th, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '1',
    floor: 'st',
    apartment: 'th',
    postalCode: '8700',
    city: 'Horsens',
  },
  {
    id: '0a3f50bb-521f-32b8-e044-0003ba298018',
    address: 'Fredrik Bajers Gade 1, 1. tv, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '1',
    floor: '1',
    apartment: 'tv',
    postalCode: '8700',
    city: 'Horsens',
  },
  {
    id: '0a3f50bb-521d-32b8-e044-0003ba298018',
    address: 'Fredrik Bajers Gade 1, 1. mf, 8700 Horsens',
    streetName: 'Fredrik Bajers Gade',
    streetNumber: '1',
    floor: '1',
    apartment: 'mf',
    postalCode: '8700',
    city: 'Horsens',
  },
]

export const mocks = [...personalInformationQueryMocks, ...createQuoteMocks]
