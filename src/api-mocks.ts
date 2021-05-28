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
    address: 'Fredrik Bajers Vej 1, 9220 Aalborg Øst',
    id: '0a3f509c-3bf9-32b8-e044-0003ba298018',
    streetNumber: '1',
  },
  {
    address: 'Fredrik Bajers Vej 1B, 9220 Aalborg Øst',
    id: '42858857-d5c9-494b-b9ab-e88518781763',
    streetNumber: '1B',
  },
  {
    address: 'Fredrik Bajers Vej 1C, 9220 Aalborg Øst',
    id: '037002fb-a322-4b7e-b1a5-b2baecd8931e',
    streetNumber: '1C',
  },
  {
    address: 'Fredrik Bajers Vej 2, 9220 Aalborg Øst',
    id: '0a3f509c-3bfa-32b8-e044-0003ba298018',
    streetNumber: '2',
  },
  {
    address: 'Fredrik Bajers Vej 3, 9220 Aalborg Øst',
    id: '0a3f509c-3bfb-32b8-e044-0003ba298018',
    streetNumber: '3',
  },
]

export const addressAutocompleteMocksStep3: AddressAutocompleteData[] = [
  {
    address: 'Fredrik Bajers Vej 1, 9220 Aalborg Øst',
    id: '44b113ee-6260-49d0-a821-ba34e3b06b86',
    streetNumber: '1',
  },
  {
    address: 'Fredrik Bajers Vej 1, st., 9220 Aalborg Øst',
    id: '264b72d4-977f-4079-80a7-0ef9f32838ec',
    streetNumber: '1',
    floor: 'st',
  },
  {
    address: 'Fredrik Bajers Vej 1, 1., 9220 Aalborg Øst',
    id: '3a2eeea4-4168-4aa4-b34a-faa24e93efb2',
    streetNumber: '1',
    floor: '1',
  },
  {
    address: 'Fredrik Bajers Vej 1, 2., 9220 Aalborg Øst',
    id: 'f29ac6ba-e152-429c-bd44-82c070432aaf',
    streetNumber: '1',
    floor: '2',
  },
  {
    address: 'Fredrik Bajers Vej 7D, 1., 9220 Aalborg Øst',
    id: 'b4cf0e0b-8062-40d4-853b-47a742d38b03',
    streetNumber: '7D',
    floor: '1',
  },
]

export const mocks = [...personalInformationQueryMocks, ...createQuoteMocks]
