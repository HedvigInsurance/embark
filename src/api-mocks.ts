import { MockedResponse } from "@apollo/react-testing";
import personalInformationQuery from "./Components/API/personalInformation.graphql";
import createQuoteMutation from "./Components/API/createQuote.graphql";
import { ApartmentType, Data as CQData } from "./Components/API/createQuote";

const AN_UUID = "6955dd62-4994-4677-a174-7eab9a9a7b92";

export const personalInformationQueryMocks = [
  {
    request: {
      query: personalInformationQuery,
      variables: {
        input: {
          personalNumber: "1212121212"
        }
      }
    },
    result: {
      data: {
        personalInformation: {
          firstName: "Test",
          lastName: "Testerson",
          streetAddress: "Testvägen 1",
          city: "Tensta",
          postalNumber: "12345"
        }
      }
    },
    delay: 2000
  },
  {
    request: {
      query: personalInformationQuery,
      variables: {
        input: {
          personalNumber: "1111111111"
        }
      }
    },
    result: {
      data: {
        personalInformation: null
      }
    },
    delay: 2000
  }
];

export const createQuoteMocks = [
  {
    request: {
      query: createQuoteMutation,
      variables: {
        input: {
          firstName: "Test",
          lastName: "Testerson",
          ssn: "1212121212",
          apartment: {
            street: "Testvägen 1",
            zipCode: "12345",
            householdSize: 1,
            livingSpace: 50,
            type: "BRF"
          }
        }
      }
    },
    result: {
      data: {
        createQuote: {
          id: AN_UUID,
          firstName: "Test",
          lastName: "Testerson",
          expiresAt: "2019-11-20T08:52:19.405Z",
          price: {
            amount: 100,
            currency: "SEK"
          },
          details: {
            street: "Testvägen 1",
            zipCode: "12345",
            householdSize: 1,
            livingSpace: 50,
            type: ApartmentType.BRF,
            __typename: "ApartmentQuoteDetails"
          },
          __typename: "Quote"
        }
      } as CQData
    }
  }
];

export const mocks = [...personalInformationQueryMocks, ...createQuoteMocks];
